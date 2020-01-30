// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
const Types = mongoose.Types,
  ObjectId = Types.ObjectId;

module.exports = function (options = {}) {
  return async context => {
    console.log(context.data);
    let transaction;
    if (context.data.toDate === '' || context.data.fromDate === '') {
      transaction = await context.app.service('checkout').Model.aggregate(
        [
          {$unwind: '$payment.card'},
          {
            $match: {
              'pharmacy_id': ObjectId(context.data.pharmacyId)
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
        ]
      );
    } else {
      transaction = await context.app.service('checkout').Model.aggregate(
        [
          {$unwind: '$payment.card'},
          {
            $match: {
              $and: [
                {
                  'createdAt': {
                    $lte: new Date(new Date(context.data.toDate).getFullYear(), new Date(context.data.toDate).getMonth(), new Date(context.data.toDate).getDate() + 1),

                    $gte: new Date(new Date(context.data.fromDate).getFullYear(), new Date(context.data.fromDate).getMonth(), new Date(context.data.fromDate).getDate()),
                  }
                },
                {
                  'pharmacy_id': ObjectId(context.data.pharmacyId)

                }
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
        ]
      );
    }

    context.result = transaction;
    console.log(context.result);
    return context;
  };
};
