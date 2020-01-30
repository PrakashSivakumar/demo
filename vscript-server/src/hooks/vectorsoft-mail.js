const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs')
const path = require('path');
module.exports = function (options = {}) {
  return async context => {

    let success;
    const transporter = nodemailer.createTransport({
      host: 'smtpout.secureserver.net',
      port: 3535,
      auth: {
        user: 'gopi@vscript.com',
        pass: 'Kittu@439'
      }
    });

    let resumeData = {
      from: context.params.query.name + ' ' + '<gopi@vscript.com>',
      to: 'kolligopikrishna2@gmail.com, hr@vectorsoft.com, gsunil@vectorsoft.com',
      subject: context.params.query.subject,
      text: 'Resume',
      html: '<p>' + context.params.query.message + '</p>',
      attachments: [
        {
          path: './public/' + context.service.options.filename
        }
      ]
    };
    await transporter.sendMail(resumeData, (error, info) => {
      if (error) {
        success = 'UnSuccessfully.. Pls try again after some time  :(';
      } else {
        fs.readdir('public/', (err, files) => {
          if (err) throw err;
          let pathname = './public/' + context.service.options.filename

          fs.unlink(pathname, function (err) {
            if (err) return console.log(err);
            success = 'Successfully Sent...Tq :)';
          });
        });
      }
    });
    context.result = success;
    return context;
  };
};
