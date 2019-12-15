const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if(!authHeader)
      return res.status(401).send({ error: 'No Token Provided' });

      const parts = authHeader.split(' ');

      // Bearer token
      if(!parts.length === 2)
      return res.status(401).send({ error: 'Token Error' });

      const [ scheme, token ] = parts; // divide token in 2 parts

      if(!/^Bearer$/i.test(scheme))
      return res.status(401).send({ error: 'Token Malformated' });

      jwt.verify(token, authConfig.secret, (err, decoded) => {

         if (err) return res.status(401).send({ error: 'Token Invalid' });

         req.userId = decoded.id; //take id codified
         
         return next();
      });

};
