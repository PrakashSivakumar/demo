// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const {Notification} = require('./notification.model');
// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    let notification;
    let notificationType;
    let notificationRole;
    let notificationStatus;

    switch (context.path) {
      case 'rx':
        console.log('rxData', context.data);
        console.log('rxParams', context.params);
        console.log('rxResult', context.result);
        switch (context.data.notification) {
          case 'Pending':
            notificationRole = ['technician', 'pharmacist', 'patient', 'owner', 'admin'];
            notificationStatus = 'Pending Rx';
            break;
          case 'Approved':
            notificationRole = ['admin', 'technician', 'patient', 'owner', 'pharmacist'];
            notificationStatus = 'Approved Rx';
            break;
          case 'Rejected':
            notificationRole = ['admin', 'technician', 'patient', 'owner', 'pharmacist'];
            notificationStatus = 'Rejected Rx';
            break;
          case 'Release':
            notificationRole = ['admin', 'owner', 'pharmacist', 'technician'];
            notificationStatus = 'Released Rx';
            break;
          case 'TransferOut':
            console.log('transfer',context.data);
            notificationRole = ['admin', 'technician', 'patient', 'owner'];
            notificationStatus = ' Transferred Out Rx ';
        }
        if (context.method === 'create') {
          notificationRole = ['admin', 'technician', 'patient', 'owner'];
          notificationStatus = 'Created Rx';
        }

        notification = new Notification({
          triggeredBy: context.params.user ? context.params.user._id : context.data.pharmacy_id,
          notify: [{status: 'notify'}],
          notification: context.params.user ? `${context.params.user.name.firstName} ${context.params.user.name.lastName} ` + notificationStatus + context.data.rxId : 'ERX '+ context.data.rxId +'Received from Surescripts',
          notificationType: 'rx',
          pharmacy_id: context.data.pharmacy_id,
          typeStatus: context.data.notification,
          data: context.result._id,
          role: notificationRole
        });
        if (context.method === 'create' || context.data.notification === 'Rejected' ||
          context.data.notification === 'Approved' || context.data.notification === 'Pending' || context.data.notification === 'Release'
          || context.data.notification === 'TransferOut') {
          context.app.service('notification').create(notification);
        }
        break;

      case 'surescript':
        console.log('context.data', context.data);
        if (context.data.EPCS === 'NotanEPCS') {
          notification = new Notification({
            triggeredBy: null,
            notify: [{status: 'notify'}],
            notification: 'Invalid Prescriber Sign - Please contact Dr.Office ' + context.data.Phone,
            notificationType: 'InvalidEPCS',
            data: context.data.EPCS,
            role: ['admin', 'technician', 'patient',]
          });
          context.app.service('notification').create(notification);
        } else if (Object.keys(JSON.parse(context.result.message).message.body[0])[0] === 'newrx') {

          notification = new Notification({
            triggeredBy: null,
            notify: [{status: 'notify'}],
            notification: 'New ERx Received From ' + `${context.result.notificationFrom} ${context.result.senderId}`,
            notificationType: 'ERx',
            data: context.result._id,
            role: ['admin', 'technician', 'patient', 'owner',]
          });
          context.app.service('notification').create(notification);

          let obj = JSON.parse(context.data.message);
          let builder = require('xmlbuilder');
          let btoa = require('btoa');

          let statusMessage = builder.create('Message', {encoding: 'utf-8'})
            .att({'xmlns': 'http://www.ncpdp.org/schema/SCRIPT', 'version': '010', 'release': '006'})
            .ele('Header')
            .ele('To', {'Qualifier': obj.message.header[0].from[0].$.Qualifier}, context.data.senderId)
            .up()
            .ele('From', {'Qualifier': obj.message.header[0].to[0].$.Qualifier}, context.data.receipientId)
            .up()
            .ele('MessageID', context.data.messageId)
            .up()
            .ele('RelatesToMessageID', btoa(context.data.pon))
            .up()
            .ele('SentTime', (new Date()).toISOString())
            .up()
            .ele('Security').ele('Sender').ele('TertiaryIdentification').txt(obj.message.header[0].security[0].receiver[0].tertiaryidentification[0])
            .up()
            .up().ele('Receiver').ele('TertiaryIdentification').txt(obj.message.header[0].security[0].sender[0].tertiaryidentification[0])
            .up()
            .up().up().up()
            // .ele('Body').ele('Code').txt('010').up().ele('DescriptionCode').txt('C').up().ele('Description').txt('Received Successfully');
            .ele('Body').ele('Verify').ele('VerifyStatus').ele('Code').txt('010');

          context.dispatch = statusMessage.end({pretty: false});

        } else if (Object.keys(JSON.parse(context.result.message).message.body[0])[0] === 'cancelrx') {
          notification = new Notification({
            triggeredBy: null,
            notify: [{status: 'notify'}],
            notification: 'CancelRx.' + `${JSON.parse(context.result.message).message.header[0].prescriberordernumber[0]}` + ' Request From ' + `${JSON.parse(context.result.message).message.header[0].from[0]._}`,
            notificationType: 'CancelRx',
            data: context.result._id,
            role: ['admin', 'technician', 'patient', 'owner']
          });
          context.app.service('notification').create(notification);

          let obj = JSON.parse(context.data.message);
          let builder = require('xmlbuilder');
          let btoa = require('btoa');
          let xml = require('xml');

          let statusMessage = builder.create('Message', {encoding: 'utf-8'})
            .att({'xmlns': 'http://www.ncpdp.org/schema/SCRIPT', 'version': '010', 'release': '006'})
            .ele('Header')
            .ele('To', {'Qualifier': obj.message.header[0].from[0].$.Qualifier}, context.data.senderId)
            .up()
            .ele('From', {'Qualifier': obj.message.header[0].to[0].$.Qualifier}, context.data.receipientId)
            .up()
            .ele('MessageID', context.data.messageId)
            .up()
            .ele('RelatesToMessageID', obj.message.header[0].relatestomessageid[0])
            .up()
            .ele('SentTime', (new Date()).toISOString())
            .up()
            .ele('Security').ele('Sender').ele('TertiaryIdentification').txt(obj.message.header[0].security[0].receiver[0].tertiaryidentification[0])
            .up()
            .up().ele('Receiver').ele('TertiaryIdentification').txt(obj.message.header[0].security[0].sender[0].tertiaryidentification[0])
            .up()
            .up().up().up()
            .ele('Body').ele('Verify').ele('VerifyStatus').ele('Code').txt('010');

          let ack = [{
            Message: [{_attr: {xmlns: 'http://www.ncpdp.org/schema/SCRIPT', version: '010', release: '006'}},
              {
                Header: [
                  {To: [{_attr: {Qualifier: obj.message.header[0].from[0].$.Qualifier}}, context.data.senderId]},
                  {From: [{_attr: {Qualifier: obj.message.header[0].to[0].$.Qualifier}}, context.data.receipientId]},
                  {MessageID: context.data.messageId},
                  {RelatesToMessageID: btoa(context.data.pon)},
                  {SentTime: (new Date()).toISOString()}, {
                    Security: [{Sender: [{TertiaryIdentification: obj.message.header[0].security[0].receiver[0].tertiaryidentification[0]}]}, {
                      Receiver: [{TertiaryIdentification: obj.message.header[0].security[0].sender[0].tertiaryidentification[0]}]
                    }]
                  }]
              },
              {
                Body: [
                  {
                    Verify: [
                      {
                        VerifyStatus: [
                          {Code: '010'}]
                      }]
                  }]
              }]
          }];


          // console.log('Status Message:',statusMessage.end({pretty: false}));
          context.dispatch = xml(ack, {declaration: true});
          // context.dispatch = statusMessage.end({pretty: false});


        } else if (Object.keys(JSON.parse(context.result.message).message.body[0])[0] === 'refillresponse') {
          notification = new Notification({
            triggeredBy: null,
            notify: [{status: 'notify'}],
            notification: 'Refill Response for ERx. ' + `${JSON.parse(context.result.message).message.header[0].rxreferencenumber[0]}` + ' From ' + `${JSON.parse(context.result.message).message.header[0].from[0]._}`,
            notificationType: 'ERx Refill Response',
            data: JSON.parse(context.result.message).message.header[0].rxreferencenumber[0],
            role: ['admin', 'technician', 'patient', 'owner']
          });
          context.app.service('notification').create(notification);

          let obj = JSON.parse(context.data.message);
          let builder = require('xmlbuilder');
          let btoa = require('btoa');

          let statusMessage = builder.create('Message', {encoding: 'utf-8'})
            .att({'xmlns': 'http://www.ncpdp.org/schema/SCRIPT', 'version': '010', 'release': '006'})
            .ele('Header')
            .ele('To', {'Qualifier': obj.message.header[0].from[0].$.Qualifier}, context.data.senderId)
            .up()
            .ele('From', {'Qualifier': obj.message.header[0].to[0].$.Qualifier}, context.data.receipientId)
            .up()
            .ele('MessageID', context.data.messageId)
            .up()
            .ele('RelatesToMessageID', btoa(context.data.pon))
            .up()
            .ele('SentTime', (new Date()).toISOString())
            .up()
            .ele('Security').ele('Sender').ele('TertiaryIdentification').txt(obj.message.header[0].security[0].receiver[0].tertiaryidentification[0])
            .up()
            .up().ele('Receiver').ele('TertiaryIdentification').txt(obj.message.header[0].security[0].sender[0].tertiaryidentification[0])
            .up()
            .up().up().up()
            // .ele('Body').ele('Code').txt('010').up().ele('DescriptionCode').txt('C').up().ele('Description').txt('Received Successfully');
            .ele('Body').ele('Verify').ele('VerifyStatus').ele('Code').txt('010');


          context.dispatch = statusMessage.end({pretty: false});
        }

        break;

      case 'patient':
        notification = new Notification({
          triggeredBy: context.params.user._id,
          notify: [{status: 'notify'}],
          notification: `${context.params.user.name.firstName} ${context.params.user.name.lastName} `
            + (context.method === 'create' ? ' created ' + `${context.result.name.firstName} ${context.result.name.lastName} ` + ' Patient.'
              : ' Updated ' + `${context.result.elasticData.name.firstName} ${context.result.elasticData.name.lastName} ` + ' Patient'),
          notificationType: 'patient',
          data:  (context.method === 'create') ? context.result._id : context.result.elasticData._id,
          role: ['admin', 'technician', 'patient', 'owner']
        });
        context.app.service('notification').create(notification);
        break;

      case 'product-order':
        notification = new Notification({
          triggeredBy: context.params.user._id,
          notify: [{status: 'notify'}],
          notification: (context.method === 'create' ? ' Added to Cart '
            : 'removed from Cart'),
          notificationType: 'Order',
          data: context.result._id,
          role: ['admin', 'owner']
        });
        context.app.service('notification').create(notification);
        break;

      case 'orderhistory':
        notification = new Notification({
          triggeredBy: context.params.user._id,
          notify: [{status: 'notify'}],
          notification: (context.method === 'create' ? 'Items Ordered Successfully '
            : 'removed from Cart'),
          notificationType: 'orderhistory',
          data: context.result._id,
          role: ['admin', 'owner']
        });
        context.app.service('notification').create(notification);
        break;

      case 'prescriber':
        notification = new Notification({
          triggeredBy: context.params.user._id,
          notify: [{status: 'notify'}],
          notification: `${context.params.user.name.firstName} ${context.params.user.name.lastName} `
            + (context.method === 'create' ? ' created ' + `${context.result.name.firstName} ${context.result.name.lastName} ` + ' Prescriber.'
              : ' Updated ' + `${context.result.elasticData.name.firstName} ${context.result.elasticData.name.lastName} ` + ' Prescriber'),
          notificationType: 'prescriber',
          data: (context.method === 'create') ? context.result._id : context.result.elasticData._id,
          role: ['admin', 'technician', 'patient', 'owner' ]
        });
        // console.log(notification);
        context.app.service('notification').create(notification);
        break;

      case 'message':
        context.app.service('conversation').get(context.result.conversation_id)
          .then(result => {
            notification = new Notification({
              triggeredBy: context.params.user._id,
              notify: result.participants,
              notification: `${context.params.user.name.firstName} ${context.params.user.name.lastName} `
                + 'messaged'
                + ' you.',
              notificationType: 'message',
              typeStatus:'unread',
              role: null
            });
            context.app.service('notification').create(notification);

            // const diffMs = new Date(context.result.createdAt) - new Date(result.updatedAt);
            // const diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
            // console.log(diffMins);
            // if (!result.message) {
            //   context.app.service('conversation').patch(context.result.conversation_id, {
            //     message: {
            //       status: 'notify'
            //     }
            //   }, context.params);
            // }
          });
        break;

      case 'conversation':
        switch (true) {
          case (context.result.video && context.result.video.status === 'notify'):
            notificationType = 'video';
            break;
          case (context.result.voice && context.result.voice.status === 'notify'):
            notificationType = 'voice';
            break;
          case (context.result.message && context.result.message.status === 'notify'):
            notificationType = 'message';
            break;
        }
        notification = new Notification({
          triggeredBy: context.params.user._id,
          notify: context.result.participants,
          notification: `${context.params.user.name.firstName} ${context.params.user.name.lastName} `
            + (notificationType === 'message' ? 'messaged' : 'is Calling')
            + ' you.',
          notificationType: notificationType,
          typeStatus:'unread',
          role: null
        });
        context.app.service('notification').create(notification);
        break;
    }
    return context;
  };
};
