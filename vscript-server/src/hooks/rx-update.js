// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
const Types = mongoose.Types,
  ObjectId = Types.ObjectId;
module.exports = function (options = {}) {
  return async context => {
    let rxData;
    console.log('contect', context.params)
    if (context.data.query) {
      let request = context.data.query;
      switch (request.routeName) {
        case 'updateCheckoutRx':
          rxData = await context.app.service('rx').Model.updateMany({'refills.fills': {$elemMatch: {_id: ObjectId(request.fillsId)}}},
            {
              $set: {
                'refills.fills.$.verificationStatus': 'Sold Out',
                'userDetails.userId': request.userDetails.userId,
                'userDetails.userName': request.userDetails.userName,
                'refills.fills.$.user.username': request.userDetails.userName,
                'refills.fills.$.user.lastAction': 'Sold Out'
              }
            }, {new: true});
          context.result = rxData
          break;
        case 'deleteRx':
          rxData = await context.app.service('rx').Model.updateMany({'refills.fills': {$elemMatch: {_id: ObjectId(request.fillsId)}}},
            {
              $set: {
                'refills.fills.$.verificationStatus': null,
                'refills.fills.$.status': 'Deleted',
                'refills.fills.$.user.username': request.userDetails.userName,
                'refills.fills.$.user.lastAction': 'Deleted',
                'refills.fills.$.deleteReason': request.deleteReason,
              }
            }, {new: true});
          context.result = rxData
          break;
        case 'changeVStatus':
          rxData = await context.app.service('rx').Model.updateMany({'refills.fills': {$elemMatch: {_id: ObjectId(request.fillsId)}}},
            {
              $set: {
                'refills.fills.$.verificationStatus': 'Viewed by Patient',
              }
            }, {new: true});
          context.result = rxData;
          break;
        case 'recalRx':
          rxData = await context.app.service('rx').Model.updateMany({'refills.fills': {$elemMatch: {_id: ObjectId(request.fillsId)}}},
            {
              $set: {
                'refills.fills.$.verificationStatus': null,
                'refills.fills.$.status': 'Hold',
                'refills.fills.$.user.username': request.userDetails.userName,
                'refills.fills.$.user.lastAction': 'Hold'
              }
            }, {new: true});
          context.result = rxData
          break;
        case 'isActive':
          rxData = await context.app.service('rx').Model.updateOne({_id: ObjectId(request.fillsId)},
            {
              $set: {
                'isActive': request.userDetails,
              }
            }, {new: true});
          context.result = rxData
          break;
        case 'annotate':
          rxData = await context.app.service('rx').Model.updateOne({'refills.fills': {$elemMatch: {_id: ObjectId(request.fillsId)}}},
            {
              $set: {
                'refills.fills.$.notes.annotate': request.text,
                'refills.fills.$.user.username': request.userName,
              }
            }, {new: true});
          context.app.service('audit-logs').create({
            userId: context.params.user._id,
            pharmacyId: context.data.query.pharmacyId,
            username: (context.params.user.username === '') ? 'External User' : context.params.user.username,
            rxId: context.data.query.rxnumber,
            messageId: String,
            data: JSON.stringify(context.data),
            service: context.path,
            method: (context.method === 'patch') ? 'Updated' : context.method,
            description: context.params.user.username + (context.method === 'patch') ? 'Updated' + ' ' + 'annotate field' + ' ' + context.data.query.rxnumber : context.method + ' ' + 'annotate field' + ' ' + context.data.query.rxnumber,
            outcome: context.error ? 'Failed' : 'Success',
          });
          context.result = rxData
          break;
        case 'inActive':
          rxData = await context.app.service('rx').Model.updateMany({_id: ObjectId(request.fillsId)},
            {
              $unset: {
                'isActive': ''
              }
            }, {new: true});
          context.result = rxData
          break;
        case 'comment':
          rxData = await context.app.service('rx').Model.updateMany({'refills.fills': {$elemMatch: {_id: ObjectId(request.fillsId)}}},
            {
              $set: {
                'refills.fills.$.notes.comment': request.comment,
                'refills.fills.$.user.username': request.userName,
              }
            }, {new: true});
          break;
        case 'note':
          rxData = await context.app.service('rx').Model.updateMany({'refills.fills': {$elemMatch: {_id: ObjectId(request.fillsId)}}}, {
            $set: {
              'refills.fills.$.notes.note': request.note,
              'refills.fills.$.user.username': request.userName,
            }
          }, {new: true});
          break;
        case 'releaseRx':
          rxData = await context.app.service('rx').Model.updateMany({'refills.fills': {$elemMatch: {_id: ObjectId(request.fillsId)}}},
            {
              $set: {
                'refills.fills.$.verificationStatus': 'Release',
                'refills.fills.$.user.username': request.userDetails.userName,
                'refills.fills.$.user.lastAction': 'Release',
              }
            },
            {new: true});

          context.result = rxData
          break;
      }
    } else if (context.method === 'patch') {
      if (context.data.refills) {
        if (context.error) {
          context.data.refills.fills[0].user.outcome = 'failure';
        } else {
          context.data.refills.fills[0].user.outcome = 'success';
        }
      }
      if (context.data.rxId) {
        context.app.service('rx-logs').create(context.data).then(result => {
          resolve(result);
        }).catch(err => console.log(err));
      } else if (context.method === 'patch') {
        context.app.service('rx').find({_id: context.data._id}).then(result => {
          if (result) {
            delete result.data[0]._id;
            context.app.service('rx-logs').create(result).then(result => {
              resolve(result);
            }).catch(err => console.log(err));
          } else {
            resolve(result);
          }
        });
      } else {
        context.app.service('rx').find({
          _id: context.data.query._id
        }).then(result => {
          if (result.data.length > 0) {
            delete result.data[0]._id;
            context.app.service('rx-logs').create(result.data[0]).then(result => {
              resolve(result);
            }).catch(err => console.log(err));
          } else {
            resolve(result);
          }
        });
      }
    }
    return context;
  };
};
