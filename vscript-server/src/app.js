const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');
const winston = require('winston');
const xmlparser = require('express-xml-bodyparser');
const cron = require('node-cron');
const nodemailer = require('nodemailer');


const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const feathersLogger = require('feathers-logger');


// const routes = require('feathers-hooks-rediscache').cacheRoutes;
// const redisClient = require('feathers-hooks-rediscache').redisClient;

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');
const mongoose = require('./mongoose');


const authentication = require('./authentication');

const mongodb = require('./mongodb');

const app = express(feathers());
const transporter = nodemailer.createTransport({
  host: 'smtpout.secureserver.net',
  port: 3535,
  auth: {
    user: 'gopi@vscript.com',
    pass: 'Kittu@439'
  }
});
//Logger
app.configure(feathersLogger(winston));
// Load app configuration
app.configure(configuration());
// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(xmlparser());
app.use(express.urlencoded({extended: true}));
app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
// Host the public folder
app.use('/', express.static(app.get('public')));

// Set up Plugins and providers
app.configure(express.rest());


//xml formatter
// app.configure(express.rest(function (req, res) {
//   // Format the message as text/plain
//   res.format({
//     'text/plain': function () {
//       res.end(res.data);
//     }
//   });
// }));

function dialyAuditLogs() {
  return new Promise((resolve, reject) => {
      app.service('audit-logs').Model.aggregate(
        [
          {
            $match: {
              $and: [
                {
                  'service': {
                    $in: ['rx', 'users', 'patient', 'prescriber', 'surescript']
                  }
                },
                {
                  'createdAt': {
                    $lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),

                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
                  }
                }
              ]
            }
          },
          {
            $sort: {'createdAt': 1},
          },
          {
            $group: {
              _id: {},
              itemsArray: {
                $push: {
                  username: '$username',
                  rxId: '$rxId',
                  patient: '$patient',
                  prescriber: '$prescriber',
                  drug: '$drug',
                  dea: '$dea',
                  messageId: '$messageId',
                  updateFields: '$updateFields',
                  previousValues: '$previousValues',
                  currentValues: '$currentValues',
                  service: '$service',
                  method: '$method',
                  description: '$description',
                  outcome: '$outcome',
                  y: {
                    '$year': '$createdAt'
                  },
                  m: {
                    '$month': '$createdAt'
                  },
                  d: {
                    '$dayOfMonth': '$createdAt'
                  },
                  h: {
                    '$hour': { date: '$createdAt', timezone: 'America/New_York' }
                  },
                  mi: {
                    '$minute': { date: '$createdAt', timezone: 'America/New_York' }
                  }
                }
              }
            }
          }
        ]).then(result => {
        resolve(result);
      }).catch(err => reject(err));
    }
  );
}

function dialyRxLogs() {
  return new Promise((resolve, reject) => {
      app.service('audit-logs').Model.aggregate(
        [
          {
            $match: {
              $and: [
                {
                  'service': {
                    $in: ['rx']
                  }
                },
                {
                  'rxId': {
                    $nin: ['', 'NA']
                  }
                },

                {
                  'createdAt': {
                    $lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
                  }
                }
              ]
            }
          },
          {
            $sort: {'createdAt': 1},
          },
          {
            $group: {
              _id: {
                rxId: '$rxId',
              },
              itemsArray: {
                $push: {
                  username: '$username',
                  rxId: '$rxId',
                  patient: '$patient',
                  prescriber: '$prescriber',
                  drug: '$drug',
                  dea: '$dea',
                  messageId: '$messageId',
                  updateFields: '$updateFields',
                  previousValues: '$previousValues',
                  currentValues: '$currentValues',
                  service: '$service',
                  method: '$method',
                  description: '$description',
                  outcome: '$outcome',
                  y: {
                    '$year': '$createdAt'
                  },
                  m: {
                    '$month': '$createdAt'
                  },
                  d: {
                    '$dayOfMonth': '$createdAt'
                  },
                  h: {
                    '$hour': { date: '$createdAt', timezone: 'America/New_York' }
                  },
                  mi: {
                    '$minute': { date: '$createdAt', timezone: 'America/New_York' }
                  }
                }
              }
            },
          }
        ]).then(result => {
        resolve(result);
      }).catch(err => reject(err));
    }
  );
}

function dialyloginLogs() {
  return new Promise((resolve, reject) => {
      app.service('loginlogs').Model.aggregate(
        [
          {
            $match: {
              'createdAt': {
                $lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),

                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
              }
            }
          },
          {
            $sort: {'createdAt': 1},
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
              'data': '$data',
              'user': '$username',
              'failed': {
                '$cond': [{$eq: ['$outcome', 'failed']}, 1, 0]
              },
            }
          },
          {
            $group: {
              _id: {
                'year': '$y',
                'month': '$m',
                'day': '$d',
                'data': '$data',
                'user': '$user',
              },
              totalFailed: {$sum: '$failed'}
            },
          }
        ]).then(result => {
        resolve(result);
      }).catch(err => reject(err));
    }
  );
}

function weeklyAuditLogs() {
  return new Promise((resolve, reject) => {
      app.service('audit-logs').Model.aggregate(
        [
          {
            $match: {
              $and: [
                {
                  'service': {
                    $in: ['rx', 'users', 'patient', 'prescriber', 'surescript']
                  }
                },
                {
                  'createdAt': {
                    $lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),

                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7),
                  }
                }
              ]
            }
          },
          {
            $sort: {'createdAt': 1},
          },
          {
            $group: {
              _id: {},
              itemsArray: {
                $push: {
                  username: '$username',
                  rxId: '$rxId',
                  patient: '$patient',
                  prescriber: '$prescriber',
                  drug: '$drug',
                  dea: '$dea',
                  messageId: '$messageId',
                  updateFields: '$updateFields',
                  previousValues: '$previousValues',
                  currentValues: '$currentValues',
                  service: '$service',
                  method: '$method',
                  description: '$description',
                  outcome: '$outcome',
                  y: {
                    '$year': '$createdAt'
                  },
                  m: {
                    '$month': '$createdAt'
                  },
                  d: {
                    '$dayOfMonth': '$createdAt'
                  },
                  h: {
                    '$hour': { date: '$createdAt', timezone: 'America/New_York' }
                  },
                  mi: {
                    '$minute': { date: '$createdAt', timezone: 'America/New_York' }
                  }
                }
              }
            }
          }
        ]).then(result => {
        resolve(result);
      }).catch(err => reject(err));
    }
  );
}

function weeklyRxLogs() {
  return new Promise((resolve, reject) => {
      app.service('audit-logs').Model.aggregate(
        [
          {
            $match: {
              $and: [
                {
                  'service': {
                    $in: ['rx']
                  }
                },
                {
                  'rxId': {
                    $nin: ['', 'NA']
                  }
                },

                {
                  'createdAt': {
                    $lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),
                    $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7),
                  }
                }
              ]
            }
          },
          {
            $sort: {'createdAt': 1},
          },
          {
            $group: {
              _id: {
                rxId: '$rxId',
              },
              itemsArray: {
                $push: {
                  username: '$username',
                  rxId: '$rxId',
                  patient: '$patient',
                  prescriber: '$prescriber',
                  drug: '$drug',
                  dea: '$dea',
                  messageId: '$messageId',
                  updateFields: '$updateFields',
                  previousValues: '$previousValues',
                  currentValues: '$currentValues',
                  service: '$service',
                  method: '$method',
                  description: '$description',
                  outcome: '$outcome',
                  y: {
                    '$year': '$createdAt'
                  },
                  m: {
                    '$month': '$createdAt'
                  },
                  d: {
                    '$dayOfMonth': '$createdAt'
                  },
                  h: {
                    '$hour': { date: '$createdAt', timezone: 'America/New_York' }
                  },
                  mi: {
                    '$minute': { date: '$createdAt', timezone: 'America/New_York' }
                  }
                }
              }
            },
          }
        ]).then(result => {
        resolve(result);
      }).catch(err => reject(err));
    }
  );
}

function weeklyloginLogs() {
  return new Promise((resolve, reject) => {
      app.service('loginlogs').Model.aggregate(
        [
          {
            $match: {
              'createdAt': {
                $lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),

                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7),
              }
            }
          },
          {
            $sort: {'createdAt': 1},
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
              'data': '$data',
              'user': '$username',
              'failed': {
                '$cond': [{$eq: ['$outcome', 'failed']}, 1, 0]
              },
            }
          },
          {
            $group: {
              _id: {
                'year': '$y',
                'month': '$m',
                'day': '$d',
                'data': '$data',
                'user': '$user',
              },
              totalFailed: {$sum: '$failed'}
            },
          }
        ]).then(result => {
        resolve(result);
      }).catch(err => reject(err));
    }
  );
}

function dialyaudit() {
  return new Promise((resolve, reject) => {
      app.service('audit').Model.aggregate(
        [
          {
            $match: {
              'ts': {
                $lte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),

                $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
              }
            }
          },
          {
            $sort: {'ts': 1},
          },
        ]).then(result => {
        resolve(result);
      }).catch(err => reject(err));
    }
  );
}

app.configure(socketio(function (io) {
    io.sockets.setMaxListeners(100);
    cron.schedule('0 9 * * *', async context => {

      let auditdata = await dialyAuditLogs();
      let rxlogData = await dialyRxLogs();
      let loginData = await dialyloginLogs();
      const auditcontent = auditdata.reduce(function (a, b) {
        return a +
          b.itemsArray.reduce(function (c, d) {
            return c + `<tr>
                  <td> ${d.rxId} </td>
                   <td>${d.prescriber}</td>
                   <td>${d.drug}</td>
                   <td>${d.username}</td>
                   <td>${d.updateFields[0]}: ${d.previousValues[0]} : ${d.currentValues[0]}</td>
                   <td>${d.service}</td>
                   <td>${d.method}</td>
                   <td>${d.description}</td>
                   <td>${d.outcome}</td>
                   <td>${d.m}/${d.d}/${d.y} ${d.h}:${d.mi}</td></tr>`;
          }, '');
      }, '');
      const rxcontent = rxlogData.reduce(function (a, b) {
        return a +
          b.itemsArray.reduce(function (c, d) {
            return c + `<tr>
                  <td> ${d.rxId} </td>
                   <td>${d.prescriber}</td>
                   <td>${d.drug}</td>
                   <td>${d.username}</td>
                   <td>${d.updateFields[0]}: ${d.previousValues[0]} : ${d.currentValues[0]}</td>
                   <td>${d.service}</td>
                   <td>${d.method}</td>
                   <td>${d.description}</td>
                   <td>${d.outcome}</td>
                   <td>${d.m}/${d.d}/${d.y}  ${d.h}:${d.mi}</td></tr>`;
          }, '');
      }, '');
      const logincontent = loginData.reduce(function (a, b) {
        return a + `<tr>
      <td> ${b._id.day}/${b._id.month}/${b._id.year} </td>
      <td> ${b._id.data} </td>
      <td> ${b._id.user} </td>
      <td>${b.totalFailed}</td>
      </tr>`;
      }, '');
      const auditoutput =
        `<table border=".5" style="width: 100%; font-size: 15px">
        <tr>
        <th>rxId</th>
        <th>Prescriber</th>
        <th>Drug</th>
        <th>User</th>
        <th>UpdateFields</th>
        <th>Service</th>
        <th>Method</th>
        <th>Description</th>
        <th>Outcome</th>
        <th>Date</th></tr>` + auditcontent + '</table>';
      const rxOutput =
        `<table border=".5" style="width: 100%; font-size: 15px">
        <tr>
        <th>rxId</th>
        <th>Prescriber</th>
        <th>Drug</th>
        <th>User</th>
        <th>UpdateFields</th>
        <th>Service</th>
        <th>Method</th>
        <th>Description</th>
        <th>Outcome</th>
        <th>Date</th></tr>` + rxcontent + '</table>';
      const loginlogData =
        `<table border=".5" style="width: 100%; font-size: 15px">
      <tr>
      <th>Date</th>
      <th>IP</th>
      <th>UserName</th>
      <th>Failed</th>
   </tr>` + logincontent + '</table>';
      let auditOptions = {
        from: '"Vscript" <gopi@vscript.com>',
        to: 'kolligopikrishna2@gmail.com, prakash@vscript.com',
        subject: 'Auditlogs daily Reports',
        text: 'Adudit Report',
        html: auditoutput
      };
      let rxOptions = {
        from: '"Vscript" <gopi@vscript.com>',
        to: 'kolligopikrishna2@gmail.com, prakash@vscript.com',
        subject: 'Rxlogs daily Reports',
        text: 'Adudit Report',
        html: rxOutput
      };
      let loginOptions = {
        from: '"Vscript" <gopi@vscript.com>',
        to: 'kolligopikrishna2@gmail.com, prakash@vscript.com',
        subject: 'InvalidLoginlogs daily Reports',
        text: 'Adudit Report',
        html: loginlogData
      };
      await transporter.sendMail(auditOptions);
      await transporter.sendMail(rxOptions);
      await transporter.sendMail(loginOptions);
      return context;
    });
    cron.schedule('0 9 * * *', async context => {

      let audit = await dialyaudit();
      app.service('gcpauditbucket').create({
        auditdata: audit
      }, {
        query: {
          name: 'auditLogs' + new Date().getFullYear() + new Date().getMonth() + new Date().getDate() + new Date(new Date().getTime() + 4 * 60 * 60 * 1000).toLocaleTimeString()
        }
      });

      const auditlogs = audit.reduce(function (a, b) {
        return a + `<tr>
              <td> ${new Date(b.ts).getFullYear() + '/' + new Date(b.ts).getMonth() + '/' + new Date(b.ts).getDate()} </td>
              <td> ${b.users ? b.users[0] ? b.users[0].user : '' : ''} </td>
              <td> ${b.param.args.$db} </td>
              <td>${b.param.ns}</td>
              <td>${b.param.command}</td>
              <td>${b.param.args.documents ? b.param.args.documents[0] ? b.param.args.documents[0] : '' : ''}</td>
</tr>`;
      }, '');
      const auditdatas =
        `<table border=".5" style="width: 100%; font-size: 15px">
        <tr>
        <th>Date</th>
        <th>UserName</th>
        <th>Database Name</th>
        <th>TableName</th>
        <th>Action</th>
        <th>Data</th>
        </tr>` + auditlogs + '</table>';

      let auditoption = {
        from: '"Vscript" <gopi@vscript.com>',
        to: 'kolligopikrishna2@gmail.com,  prakash@vscript.com',
        subject: 'Auidit Reports Daily',
        text: 'Adudit Report',
        html: auditdatas
      };
      await transporter.sendMail(auditoption);

      return context;
    });
    cron.schedule('0 9 * * 1', async context => {

      let auditdata = await weeklyAuditLogs();
      let rxlogData = await weeklyRxLogs();
      let loginData = await weeklyloginLogs();
      const auditcontent = auditdata.reduce(function (a, b) {
        return a +
          b.itemsArray.reduce(function (c, d) {
            return c + `<tr>
                  <td> ${d.rxId} </td>
                   <td>${d.prescriber}</td>
                   <td>${d.drug}</td>
                   <td>${d.username}</td>
                   <td>${d.updateFields[0]}: ${d.previousValues[0]} : ${d.currentValues[0]}</td>
                   <td>${d.service}</td>
                   <td>${d.method}</td>
                   <td>${d.description}</td>
                   <td>${d.outcome}</td>
                   <td>${d.m}/${d.d}/${d.y}  ${d.h}:${d.mi}</td></tr>`;
          }, '');
      }, '');
      const rxcontent = rxlogData.reduce(function (a, b) {
        return a +
          b.itemsArray.reduce(function (c, d) {
            return c + `<tr>
                  <td> ${d.rxId} </td>
                   <td >${d.prescriber}</td>
                   <td>${d.drug}</td>
                   <td>${d.username}</td>
                   <td>${d.updateFields[0]}: ${d.previousValues[0]} : ${d.currentValues[0]}</td>
                   <td>${d.service}</td>
                   <td>${d.method}</td>
                   <td>${d.description}</td>
                   <td>${d.outcome}</td>
                   <td>${d.m}/${d.d}/${d.y}  ${d.h}:${d.mi}</td></tr>`;
          }, '');
      }, '');
      const logincontent = loginData.reduce(function (a, b) {
        return a + `<tr>
      <td> ${b._id.day} / ${b._id.month}/ ${b._id.year} </td>
      <td> ${b._id.data} </td>
      <td> ${b._id.user} </td>
      <td>${b.totalFailed}</td>
      </tr>`;
      }, '');

      const auditoutput =
        `<table border=".5" style="width: 100%; font-size: 15px">
        <tr>
        <th>rxId</th>
        <th>Prescriber</th>
        <th>Drug</th>
        <th>User</th>
        <th>UpdateFields</th>
        <th>Service</th>
        <th>Method</th>
        <th>Description</th>
        <th>Outcome</th>
        <th>Date</th></tr>` + auditcontent + '</table>';
      const rxOutput =
        `<table border=".5" style="width: 100%; font-size: 15px">
        <tr>
        <th>rxId</th>
        <th>Prescriber</th>
        <th>Drug</th>
        <th>User</th>
        <th>UpdateFields</th>
        <th>Service</th>
        <th>Method</th>
        <th>Description</th>
        <th>Outcome</th>
        <th>Date</th></tr>` + rxcontent + '</table>';
      const loginlogData =
        `<table border=".5" style="width: 100%; font-size: 15px">
      <tr>
      <th>Date</th>
      <th>IP</th>
      <th>UserName</th>
      <th>Failed</th>
   </tr>` + logincontent + '</table>';

      let auditOptions = {
        from: '"Vscript" <gopi@vscript.com>',
        to: 'kolligopikrishna2@gmail.com, prakash@vscript.com ',
        subject: 'Auditlogs Weekly Reports',
        text: 'Adudit Report',
        html: auditoutput
      };
      let rxOptions = {
        from: '"Vscript" <gopi@vscript.com>',
        to: 'kolligopikrishna2@gmail.com, prakash@vscript.com ',
        subject: 'Rxlogs Weekly Reports',
        text: 'Adudit Report',
        html: rxOutput
      };
      let loginOptions = {
        from: '"Vscript" <gopi@vscript.com>',
        to: 'kolligopikrishna2@gmail.com, prakash@vscript.com ',
        subject: 'InvalidLoginlogs Weekly Reports',
        text: 'Adudit Report',
        html: loginlogData
      };
      await transporter.sendMail(auditOptions);
      await transporter.sendMail(rxOptions);
      await transporter.sendMail(loginOptions);
      return context;
    });
  }
));
app.configure(mongoose);
app.configure(mongodb);
// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

//redis
// app.configure(redisClient);
//cache routes
// app.use('/cache',routes(app));
// Configure a middleware for 404s and the error handler

app.use(express.notFound());
app.use(express.errorHandler({logger}));
app.hooks(appHooks);


module.exports = app;
