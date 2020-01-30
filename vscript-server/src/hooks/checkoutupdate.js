// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
const Types = mongoose.Types,
  ObjectId = Types.ObjectId;
module.exports = function (options = {}) {
  return async context => {
    let rxData;
    console.log('conghh', context.data);
    let request = context.data.query;
    console.log('jhjhj', request);

    rxData = await context.app.service('checkout').Model.updateMany({'item': {$elemMatch: {'_id': ObjectId(request.id)}}},
      {
        $set: {
          'item.$.statusCode': 'Refund',
          'item.$.amount':0,
          'price.totalAmount':0
        }
      }, {new: true});
    context.result = rxData;
    return context;

  };
};
