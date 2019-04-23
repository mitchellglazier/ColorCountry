const functions = require('firebase-functions');

const nodemailer = require('nodemailer');
const gmailEmail = encodeURIComponent(functions.config().gmail.email);
const gmailPassword = encodeURIComponent(functions.config().gmail.password);
const mailTransport = nodemailer.createTransport(`smtps://${gmailEmail}:${gmailPassword}@smtp.gmail.com`);

exports.sendContactMessage = functions.database.ref('/messages/{pushKey}').onWrite((event) => {
    const snapshot = event.after;

//   Only send email for new messages.
    if (event.before || !snapshot.val().name) {
      return;
    }

    const val = snapshot.val();
    
    const mailOptions = {
      to: 'glazier@gmail.com',
      subject: `Information Request from ${val.name}`,
      html: val.html
    };
    return mailTransport.sendMail(mailOptions).then(() => {
     return console.log('Mail sent to: glazierm@gmail.com');
});
});
