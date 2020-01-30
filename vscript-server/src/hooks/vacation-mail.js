// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html


const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs')
const path = require('path');
const cron = require('node-cron');

function dialyDashboardReport(context, formValue) {
  return new Promise((resolve, reject) => {
    context.app.service('checkout').Model.aggregate(
      [
        {$unwind: '$payment.card'},
        {
          $match: {
            $and: [
              {
                'createdAt': {
                  $lte: new Date(new Date(formValue.enddate).getFullYear(), new Date(formValue.enddate).getMonth(), new Date(formValue.enddate).getDate() + 1),

                  $gte: new Date(new Date(formValue.startdate).getFullYear(), new Date(formValue.startdate).getMonth(), new Date(formValue.startdate).getDate()),
                }
              },
              // {
              //   'pharmacy_id': ObjectId(context.data.pharmacyId)
              // }
            ]
          }
        },
        {
          $project: {
            'y': {
              '$year': '$createdAt'
            },
            'm': {
              '$month': '$createdAt'
            },
            'd': {
              '$dayOfMonth': '$createdAt'
            },
            'totalAmount': '$price.totalAmount',
            'totalMargin': '$price.totalMargin',
            'Cash': '$payment.cash.cashAmount',
            'Card': '$payment.card.cardAmount',
            'Check': '$payment.check.checkAmount'
          }
        },
        {
          $group: {
            _id: {
              'year': '$y',
              'month': '$m',
              'day': '$d'
            },
            totalAmount: {$sum: '$totalAmount'},
            totalMargin: {$sum: '$totalMargin'},
            Cash: {$sum: '$Cash'},
            Card: {$sum: '$Card'},
            Check: {$sum: '$Check'}
          },
        }
      ]).then(result => {
        resolve(result);
      }).catch(err => reject(err));
    });
}

function weeklyDashboardReport(context, formValue) {
  return new Promise((resolve, reject) => {
    context.app.service('checkout').Model.aggregate(
      [
        {$unwind: '$payment.card'},
        {
          $match: {
            $and: [
              {
                'createdAt': {
                  $lte: new Date(new Date(formValue.enddate).getFullYear(), new Date(formValue.enddate).getMonth(), new Date(formValue.enddate).getDate() + 1),

                  $gte: new Date(new Date(formValue.startdate).getFullYear(), new Date(formValue.startdate).getMonth(), new Date(formValue.startdate).getDate()),
                }
              },
              // {
              //   'pharmacy_id': ObjectId(context.data.pharmacyId)
              // }
            ]
          }
        },
        {
          $project: {
            'y': {
              '$year': '$createdAt'
            },
            'm': {
              '$month': '$createdAt'
            },
            'd': {
              '$dayOfMonth': '$createdAt'
            },
            'totalAmount': '$price.totalAmount',
            'totalMargin': '$price.totalMargin',
            'Cash': '$payment.cash.cashAmount',
            'Card': '$payment.card.cardAmount',
            'Check': '$payment.check.checkAmount'
          }
        },
        {
          $group: {
            _id: {
              'year': '$y',
              'month': '$m',
              'day': '$d'
            },
            totalAmount: {$sum: '$totalAmount'},
            totalMargin: {$sum: '$totalMargin'},
            Cash: {$sum: '$Cash'},
            Card: {$sum: '$Card'},
            Check: {$sum: '$Check'}
          },
        }
      ]).then(result => {
      resolve(result);
    }).catch(err => reject(err));
  });
}

function monthlyDashboardReport(context, formValue) {
  return new Promise((resolve, reject) => {
    context.app.service('checkout').Model.aggregate(
      [
        {$unwind: '$payment.card'},
        {
          $match: {
            $and: [
              {
                'createdAt': {
                  $lte: new Date(new Date(formValue.enddate).getFullYear(), new Date(formValue.enddate).getMonth(), new Date(formValue.enddate).getDate() + 1),

                  $gte: new Date(new Date(formValue.startdate).getFullYear(), new Date(formValue.startdate).getMonth(), new Date(formValue.startdate).getDate()),
                }
              },
              // {
              //   'pharmacy_id': ObjectId(context.data.pharmacyId)
              // }
            ]
          }
        },
        {
          $project: {
            'y': {
              '$year': '$createdAt'
            },
            'm': {
              '$month': '$createdAt'
            },
            'd': {
              '$dayOfMonth': '$createdAt'
            },
            'totalAmount': '$price.totalAmount',
            'totalMargin': '$price.totalMargin',
            'Cash': '$payment.cash.cashAmount',
            'Card': '$payment.card.cardAmount',
            'Check': '$payment.check.checkAmount'
          }
        },
        {
          $group: {
            _id: {
              'year': '$y',
              'month': '$m',
              'day': '$d'
            },
            totalAmount: {$sum: '$totalAmount'},
            totalMargin: {$sum: '$totalMargin'},
            Cash: {$sum: '$Cash'},
            Card: {$sum: '$Card'},
            Check: {$sum: '$Check'}
          },
        }
      ]).then(result => {
      resolve(result);
    }).catch(err => reject(err));
  });
}

module.exports = function (options = {}) {
  return async context => {
    if (context.params.query.formValue) {
      let formValue = context.params.query.formValue;
      let contextValue = context;
      console.log('endDate, todayDate', context.params.query.formValue.enddate, new Date());
      console.log('fullDate', new Date(context.params.query.formValue.enddate).getDate(), new Date(context.params.query.formValue.enddate).getMonth() + 1, new Date(context.params.query.formValue.enddate).getFullYear(),
        new Date().getDate(), new Date().getMonth() + 1, new Date().getFullYear());

      if(context.params.query.formValue.frequency === 'Daily') {
        let dailyJob = cron.schedule('0 9 * * *', async context => {
          const transporter = nodemailer.createTransport({
            host: 'smtpout.secureserver.net',
            port: 3535,
            auth: {
              user: 'gopi@vscript.com',
              pass: 'Kittu@439'
            }
          });

          let dashboardData = await dialyDashboardReport(contextValue, formValue);
          console.log('dashboard Data', dashboardData);

          const dashboardcontent = dashboardData.reduce(function (a, b) {
            return a + `<tr>
                         <td>${b._id.day}/ ${b._id.month}/ ${b._id.year}</td>
                         <td> ${b.totalAmount} </td>
                         <td>${b.totalMargin}</td>
                         <td>${b.Cash}</td>
                         <td>${b.Card}</td>
                         <td>${b.Check}</td>
                     </tr>`;
          }, '');

          const dashboardoutput =
            `<table border=".5" style="width: 100%; font-size: 15px">
          <tr>
          <th>Date</th>
          <th>TotalAmount</th>
          <th>TotalMargin</th>
          <th>Cash</th>
          <th>Card</th>
          <th>Check</th>
          </tr>` + dashboardcontent + '</table>';

          let dashboardOptions = {
            from: '"Vscript" <gopi@vscript.com>',
            to: 'rameshvscript@gmail.com, prakash@vscript.com',
            subject: 'Dashboard Daily Reports',
            text: 'Dashboard Report',
            html: dashboardoutput
          };

          await transporter.sendMail(dashboardOptions);
          //   return context;
        });
        if ((new Date(context.params.query.formValue.enddate).getDate() === new Date().getDate()) && (new Date(context.params.query.formValue.enddate).getMonth() + 1 === new Date().getMonth() + 1) && (new Date(context.params.query.formValue.enddate).getFullYear() === new Date().getFullYear())) {
          // dailyJob.start();
          dailyJob.stop();
        } else {
          dailyJob.start();
        }
      }
      else if(context.params.query.formValue.frequency === 'Weekly') {
        let weeklyJob = cron.schedule('0 9 * * 1', async context => {
          const transporter = nodemailer.createTransport({
            host: 'smtpout.secureserver.net',
            port: 3535,
            auth: {
              user: 'gopi@vscript.com',
              pass: 'Kittu@439'
            }
          });

          let dashboardData = await weeklyDashboardReport(contextValue, formValue);
          console.log('dashboard Data', dashboardData);

          const dashboardcontent = dashboardData.reduce(function (a, b) {
            return a + `<tr>
                         <td>${b._id.year}/ ${b._id.month}/ ${b._id.day}</td>
                         <td> ${b.totalAmount} </td>
                         <td>${b.totalMargin}</td>
                         <td>${b.Cash}</td>
                         <td>${b.Card}</td>
                         <td>${b.Check}</td>
                     </tr>`;
          }, '');

          const dashboardoutput =
            `<table border=".5" style="width: 100%; font-size: 15px">
          <tr>
          <th>Date</th>
          <th>TotalAmount</th>
          <th>TotalMargin</th>
          <th>Cash</th>
          <th>Card</th>
          <th>Check</th>
          </tr>` + dashboardcontent + '</table>';

          let dashboardOptions = {
            from: '"Vscript" <gopi@vscript.com>',
            to: 'rameshvscript@gmail.com, prakash@vscript.com',
            subject: 'Dashboard Daily Reports',
            text: 'Dashboard Report',
            html: dashboardoutput
          };

          await transporter.sendMail(dashboardOptions);
          //   return context;
        });
        if ((new Date(context.params.query.formValue.enddate).getDate() === new Date().getDate()) && (new Date(context.params.query.formValue.enddate).getMonth() + 1 === new Date().getMonth() + 1) && (new Date(context.params.query.formValue.enddate).getFullYear() === new Date().getFullYear())) {
          weeklyJob.stop();
        } else {
          // weeklyJob.start();
        }
      }
      else if(context.params.query.formValue.frequency === 'Monthly') {
        let monthlyJob = cron.schedule('0 9 1 * *', async context => {
          const transporter = nodemailer.createTransport({
            host: 'smtpout.secureserver.net',
            port: 3535,
            auth: {
              user: 'gopi@vscript.com',
              pass: 'Kittu@439'
            }
          });

          let dashboardData = await monthlyDashboardReport(contextValue, formValue);
          console.log('dashboard Data', dashboardData);

          const dashboardcontent = dashboardData.reduce(function (a, b) {
            return a + `<tr>
                         <td>${b._id.year}/ ${b._id.month}/ ${b._id.day}</td>
                         <td> ${b.totalAmount} </td>
                         <td>${b.totalMargin}</td>
                         <td>${b.Cash}</td>
                         <td>${b.Card}</td>
                         <td>${b.Check}</td>
                     </tr>`;
          }, '');

          const dashboardoutput =
            `<table border=".5" style="width: 100%; font-size: 15px">
          <tr>
          <th>Date</th>
          <th>TotalAmount</th>
          <th>TotalMargin</th>
          <th>Cash</th>
          <th>Card</th>
          <th>Check</th>
          </tr>` + dashboardcontent + '</table>';

          let dashboardOptions = {
            from: '"Vscript" <gopi@vscript.com>',
            to: 'rameshvscript@gmail.com, prakash@vscript.com',
            subject: 'Dashboard Daily Reports',
            text: 'Dashboard Report',
            html: dashboardoutput
          };

          await transporter.sendMail(dashboardOptions);
          //   return context;
        });
        if ((new Date(context.params.query.formValue.enddate).getMonth() + 1 === new Date().getMonth() + 1) && (new Date(context.params.query.formValue.enddate).getFullYear() === new Date().getFullYear())) {
          monthlyJob.stop();
        } else {
          // monthlyJob.start();
        }
      }
    }
    return context;

    // if (context.params.query.formValue) {
    //
    //   let success;
    //   const transporter = nodemailer.createTransport({
    //     host: 'smtpout.secureserver.net',
    //     port: 3535,
    //     auth: {
    //       user: 'gopi@vscript.com',
    //       pass: 'Kittu@439'
    //     }
    //   });
    //
    //
    //   let resumeData = {
    //     from: context.params.query.formValue.emailchecked + ' ' + '<gopi@vscript.com>',
    //     to: 'rameshvscript@gmail.com',
    //     subject: 'Sample testing Vacation Mail',
    //     text: 'Vacation Mail',
    //     html: '<p>' + 'This is a Sample Vacation Mail is used to test from my system. Remember this mail is sent by Ramesh' + '</p>',
    //     // attachments: [
    //     //   {
    //     //     path: './public/' + context.service.options.filename
    //     //   }
    //     // ]
    //   };
    //
    //
    //   await transporter.sendMail(resumeData, (error, info) => {
    //     if (error) {
    //       success = 'UnSuccessfull.. Please try again after some time  :(';
    //     } else {
    //       // fs.readdir('public/', (err, files) => {
    //       //   if (err) throw err;
    //       //   let pathname = './public/' + context.service.options.filename
    //       //
    //       //   fs.unlink(pathname, function (err) {
    //       //     if (err) return console.log(err);
    //       //     success = 'Successfully Sent...Tq :)';
    //       //   });
    //       // });
    //       success = 'Successfully Sent...Tq :)';
    //     }
    //   });
    //   context.result = success;
    //
    // }
    // return context;

  };
};
