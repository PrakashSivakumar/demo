const mongoose = require('mongoose');
const Types = mongoose.Types,
  ObjectId = Types.ObjectId;

function createRxLogs(context) {
  return new Promise(resolve => {
    console.log('rxlogsfor', context.data)

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
    }
    else if (context.method === 'patch') {
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
    }
    else {
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
  });
};

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    let result = await createRxLogs(context);
    context.result = result;
    return context;
  };
};
