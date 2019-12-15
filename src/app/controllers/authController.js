const express = require('express');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth');
const crypto = require('crypto');
const mailer = require('../../modules/mailer');

const router = express.Router();/*  */

function generateToken(params = { }) {
    return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400, // one day in seconds
});
}

router.post('/register', async(req, res) =>{
    const { email } = req.body;
    try {
        if(await User.findOne({ email }))
         return res.status(400).send({ error: 'User Already Exist'});

        const user = await User.create(req.body);

        user.password = undefined;

        
       res.send({ 
           user,
        token: generateToken({id: user.id}),
       });


    } catch (err) {
        return res.status(400).send({ error: 'Registrtion Failed'});
    }
});


router.post('/authenticate', async(req, res) =>{
    const { email, password } = req.body;
   
    try {
        
        const user = await User.findOne({ email }).select('+password');// not selectable

        if(!user)
         return res.status(400).send({ error: 'User Not Found'});

         if(!await bcrypt.compare(password, user.password))
         return res.status(400).send({ error: 'Invalid Password'});

         user.password = undefined;
         const token = generateToken({ id: user.id});
       res.send({ 
           user,
         token,
        });

    } catch (err) {
        return res.status(400).send({ error: 'Registration Failed'});
    }
});


router.post('/forgot_password', async(req, res) =>{
    const { email } = req.body;
   
    try {
        
        const user = await User.findOne({ email });// not selectable

        if(!user)
         return res.status(400).send({ error: 'User Not Found'});

         const token = crypto.randomBytes(20).toString('hex');

         const now = new Date();
         now.setHours(now.getHours() + 1);

         await User.findByIdAndUpdate(user.id, {
            '$set': {
                passwordResetToken: token,
                passwordResetExpires: now,
            }
         });

         console.log(token);

         mailer.sendMail({
            to: email,
            from: 'marcelu@jcunion.com',
            template: 'auth/forgot_password',
            context: { token },
         }, (err) =>{
             if (err)
             return res.status(400).send({ error: 'Cannot send mail'});

             return res.send('Mail enviado');

         });
         
    } catch (err) {
        console.log(err);
       return res.status(400).send({ error: 'Error send mail Pass,try again'});
    }
});



router.post('/reset_password', async(req, res) =>{
    const { email, token, password } = req.body;
   
    try {
        
        const user = await User.findOne({ email })// not selectable
         .select('+passwordResetToken passwordResetExpires');

        if(!user)
         return res.status(400).send({ error: 'User Not Found'});

         if(token !== user.passwordResetToken)
         return res.status(400).send({ error: 'Token Invalid'});

         const now = new Date();

         if(now > user.passwordResetExpires)
         return res.status(400).send({ error: 'Token Expired'});

       user.password = password;

       await user.save();

       res.send('resetado');
         
    } catch (err) {
        console.log(err);
       return res.status(400).send({ error: 'Cn not reset Pass,try again'});
    }
});

module.exports = app => app.use('/auth',router);