const nodemailer = require('nodemailer');
const path = require('path');

const hbs = require('nodemailer-express-handlebars');
// const mailConfig = require('../config/mail.json');
const {host, port ,user , pass} = require('../config/mail.json');

const transport = nodemailer.createTransport({
    host,
    port,
    auth: { user, pass },
  });

  transport.use('compile', hbs({
      viewEngine: 'hadlebars',
      viewPath: path.resolve('./src/resources/mail/'),
      extName: '.html',
  }));

  module.export = transport;

  /*
  var http = require('http');
var nodemailer = require('nodemailer');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});

  var fromEmail = 'akarthi@xyz.com';
  var toEmail = 'akarthi@xyz.com';

  var transporter = nodemailer.createTransport({
    host: 'domain',
    port: 587,
    secure: false, // use SSL
    debug: true,
      auth: {
        user: 'fromEmail@xyz.com',
        pass: 'userpassword'
      }
  });
   transporter.sendMail({
      from: fromEmail,
      to: toEmail,
      subject: 'Regarding forget password request',
      text: 'This is forget password response from your app',
      html: '<p>Your password is <b>sample</b></p>'
  }, function(error, response){
      if(error){
          console.log('Failed in sending mail');
          console.dir({success: false, existing: false, sendError: true});
          console.dir(error);
          res.end('Failed in sending mail');
      }else{
          console.log('Successful in sending email');
          console.dir({success: true, existing: false, sendError: false});
          console.dir(response);
          res.end('Successful in sending email');
      }
  });
}).listen(8000);
console.log('Server listening on port 8000');

response:

Successful in sending email
{ success: true, existing: false, sendError: false }
{ accepted: [ 'akarthi@xyz.com' ],
  rejected: [],
  response: '250 2.0.0 uAMACW39058154 Message accepted for delivery',
  envelope: 
   { from: 'akarthi@xyz.com',
     to: [ 'akarthi@xyz.com' ] },
  messageId: '1479809555147-33de4987-29d605fa-6ee150f1@xyz.com' }
  */