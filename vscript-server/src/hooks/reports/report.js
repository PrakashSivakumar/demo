// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');

const Types = mongoose.Types,
  ObjectId = Types.ObjectId;
module.exports = function (options = {}) {
  return async context => {
    let result;
    if (context.data.report.fromDate !== '' && context.data.report.toDate !== '') {
      switch (context.data.report.frequency) {
        case 'Daily':
          result = await context.app.service('rx').Model.aggregate(
            [
              // {$sort: {'refills.fills.createdAt': -1}},
              {$unwind: '$refills.fills'},

              {
                $match: {
                  $and: [
                    {
                      'updatedAt': {
                        $lt: new Date(new Date(context.data.report.toDate).getFullYear(), new Date(context.data.report.toDate).getMonth(), new Date(context.data.report.toDate).getDate() + 1),
                        $gte: new Date(new Date(context.data.report.fromDate).getFullYear(), new Date(context.data.report.fromDate).getMonth(), new Date(context.data.report.fromDate).getDate()),
                      }
                    },
                    {
                      'pharmacy_id': ObjectId(context.data.report.pharmacyId)
                    }
                  ]
                }
              },
              {
                $project: {
                  'y': {
                    '$year': '$updatedAt'
                  },
                  'm': {
                    '$month': '$updatedAt'
                  },
                  'd': {
                    '$dayOfMonth': '$updatedAt'
                  },
                  'ApprovedSum': {
                    '$cond': [{$eq: ['$refills.fills.verificationStatus', 'Approved']}, 1, 0]
                  },
                  'DeletedSum': {
                    '$cond': [{$eq: ['$refills.fills.status', 'Deleted']}, 1, 0]
                  },
                  'SoldOutSum': {
                    '$cond': [{$eq: ['$refills.fills.verificationStatus', 'Sold Out']}, 1, 0]
                  },
                  'PendingSum': {
                    '$cond': [{$eq: ['$refills.fills.verificationStatus', 'Pending']}, 1, 0]
                  },
                  'TransferOut': {
                    '$cond': [{$eq: ['$refills.fills.status', 'Transfer Out']}, 1, 0]
                  },
                  'TransferIn': {
                    '$cond': [{$eq: ['$refills.fills.status', 'Transfer In']}, 1, 0]
                  },
                }
              },
              {
                $group: {
                  _id: {
                    'year': '$y',
                    'month': '$m',
                    'day': '$d'
                  },
                  Approved: {$sum: '$ApprovedSum'},
                  Deleted: {$sum: '$DeletedSum'},
                  SoldOut: {$sum: '$SoldOutSum'},
                  Pending: {$sum: '$PendingSum'},
                  TransferIn: {$sum: '$TransferIn'},
                  TransferOut: {$sum: '$TransferOut'},
                  total: {$sum: 1}
                },
              }]
          );
          context.result = result;
          break;
        case 'Weekly':
          result = await context.app.service('rx').Model.aggregate(
            [
              {$unwind: '$refills.fills'},
              {
                $match: {
                  'pharmacy_id': ObjectId(context.data.report.pharmacyId)
                }
              },
              {
                $project: {
                  'y': {
                    '$year': '$updatedAt'
                  },
                  'm': {
                    '$month': '$updatedAt'
                  },
                  'd': {
                    '$dayOfMonth': '$updatedAt'
                  },
                  'ApprovedSum': {
                    '$cond': [{$eq: ['$refills.fills.verificationStatus', 'Approved']}, 1, 0]
                  },
                  'DeletedSum': {
                    '$cond': [{$eq: ['$refills.fills.status', 'Deleted']}, 1, 0]
                  },
                  'SoldOutSum': {
                    '$cond': [{$eq: ['$refills.fills.verificationStatus', 'Sold Out']}, 1, 0]
                  },
                  'PendingSum': {
                    '$cond': [{$eq: ['$refills.fills.verificationStatus', 'Pending']}, 1, 0]
                  },
                  'TransferOut': {
                    '$cond': [{$eq: ['$refills.fills.status', 'Transfer Out']}, 1, 0]
                  },
                  'TransferIn': {
                    '$cond': [{$eq: ['$refills.fills.status', 'Transfer In']}, 1, 0]
                  },
                  'eprescription': {
                    '$cond': [{$eq: ['$refills.fills.rxOriginCode', 'E-Prescription']}, 1, 0]
                  }
                }
              },
              {
                $group: {
                  _id: {
                    'year': '$y',
                    'month': '$m',
                    'day': '$d'
                  },
                  Approved: {$sum: '$ApprovedSum'},
                  Deleted: {$sum: '$DeletedSum'},
                  SoldOut: {$sum: '$SoldOutSum'},
                  Pending: {$sum: '$PendingSum'},
                  TransferIn: {$sum: '$TransferIn'},
                  TransferOut: {$sum: '$TransferOut'},
                  Epre: {$sum: '$eprescription'},
                  total: {$sum: 1}
                },
              }]
          );
          context.result = result;
          break;
        case 'Monthly':
          result = await context.app.service('rx').Model.aggregate(
            [
              {$unwind: '$refills.fills'},
              {
                $match: {
                  'pharmacy_id': ObjectId(context.data.report.pharmacyId)
                }
              },
              {
                $project: {
                  'y': {
                    '$year': '$updatedAt'
                  },
                  'm': {
                    '$month': '$updatedAt'
                  },
                  'd': {
                    '$dayOfMonth': '$updatedAt'
                  },
                  'ApprovedSum': {
                    '$cond': [{$eq: ['$refills.fills.verificationStatus', 'Approved']}, 1, 0]
                  },
                  'DeletedSum': {
                    '$cond': [{$eq: ['$refills.fills.status', 'Deleted']}, 1, 0]
                  },
                  'SoldOutSum': {
                    '$cond': [{$eq: ['$refills.fills.verificationStatus', 'Sold Out']}, 1, 0]
                  },
                  'PendingSum': {
                    '$cond': [{$eq: ['$refills.fills.verificationStatus', 'Pending']}, 1, 0]
                  },
                  'TransferOut': {
                    '$cond': [{$eq: ['$refills.fills.status', 'Transfer Out']}, 1, 0]
                  },
                  'TransferIn': {
                    '$cond': [{$eq: ['$refills.fills.status', 'Transfer In']}, 1, 0]
                  },
                  'eprescription': {
                    '$cond': [{$eq: ['$refills.fills.rxOriginCode', 'E-Prescription']}, 1, 0]
                  }
                }
              },
              {
                $group: {
                  _id: {
                    // 'year': '$y',
                    'month': '$m',
                    // 'day': '$d'
                  },
                  Approved: {$sum: '$ApprovedSum'},
                  Deleted: {$sum: '$DeletedSum'},
                  SoldOut: {$sum: '$SoldOutSum'},
                  Pending: {$sum: '$PendingSum'},
                  TransferIn: {$sum: '$TransferIn'},
                  TransferOut: {$sum: '$TransferOut'},
                  Epre: {$sum: '$eprescription'},
                  total: {$sum: 1}
                },
              }]
          );
          context.result = result;
          break;
        case 'Yearly':
          result = await context.app.service('rx').Model.aggregate(
            [
              {$unwind: '$refills.fills'},
              {
                $match: {
                  'pharmacy_id': ObjectId(context.data.report.pharmacyId)
                }
              },
              {
                $project: {
                  'y': {
                    '$year': '$updatedAt'
                  },
                  'm': {
                    '$month': '$updatedAt'
                  },
                  'd': {
                    '$dayOfMonth': '$updatedAt'
                  },
                  'ApprovedSum': {
                    '$cond': [{$eq: ['$refills.fills.verificationStatus', 'Approved']}, 1, 0]
                  },
                  'DeletedSum': {
                    '$cond': [{$eq: ['$refills.fills.status', 'Deleted']}, 1, 0]
                  },
                  'SoldOutSum': {
                    '$cond': [{$eq: ['$refills.fills.verificationStatus', 'Sold Out']}, 1, 0]
                  },
                  'PendingSum': {
                    '$cond': [{$eq: ['$refills.fills.verificationStatus', 'Pending']}, 1, 0]
                  },
                  'TransferOut': {
                    '$cond': [{$eq: ['$refills.fills.status', 'Transfer Out']}, 1, 0]
                  },
                  'TransferIn': {
                    '$cond': [{$eq: ['$refills.fills.status', 'Transfer In']}, 1, 0]
                  },
                  'eprescription': {
                    '$cond': [{$eq: ['$refills.fills.rxOriginCode', 'E-Prescription']}, 1, 0]
                  }
                }
              },
              {
                $group: {
                  _id: {
                    'year': '$y',
                    // 'month': '$m',
                    // 'day': '$d'
                  },
                  Approved: {$sum: '$ApprovedSum'},
                  Deleted: {$sum: '$DeletedSum'},
                  SoldOut: {$sum: '$SoldOutSum'},
                  Pending: {$sum: '$PendingSum'},
                  TransferIn: {$sum: '$TransferIn'},
                  TransferOut: {$sum: '$TransferOut'},
                  Epre: {$sum: '$eprescription'},
                  total: {$sum: 1}
                },
              }]
          );
          context.result = result;
          break;
      }
    } else {
      result = await context.app.service('rx').Model.aggregate(
        [
          {$unwind: '$refills.fills'},
          {
            $match: {
              $and: [
                {
                  'pharmacy_id': ObjectId(context.data.report.pharmacyId)
                }
              ]
            }
          },
          {
            $project: {
              'y': {
                '$year': '$updatedAt'
              },
              'm': {
                '$month': '$updatedAt'
              },
              'd': {
                '$dayOfMonth': '$updatedAt'
              },
              'ApprovedSum': {
                '$cond': [{$eq: ['$refills.fills.verificationStatus', 'Approved']}, 1, 0]
              },
              'DeletedSum': {
                '$cond': [{$eq: ['$refills.fills.status', 'Deleted']}, 1, 0]
              },
              'SoldOutSum': {
                '$cond': [{$eq: ['$refills.fills.verificationStatus', 'Sold Out']}, 1, 0]
              },
              'PendingSum': {
                '$cond': [{$eq: ['$refills.fills.verificationStatus', 'Pending']}, 1, 0]
              },
              'TransferOut': {
                '$cond': [{$eq: ['$refills.fills.status', 'Transfer Out']}, 1, 0]
              },
              'TransferIn': {
                '$cond': [{$eq: ['$refills.fills.status', 'Transfer In']}, 1, 0]
              },
            }
          },
          {
            $group: {
              _id: {
                'year': '$y',
                'month': '$m',
                'day': '$d'
              },
              Approved: {$sum: '$ApprovedSum'},
              Deleted: {$sum: '$DeletedSum'},
              SoldOut: {$sum: '$SoldOutSum'},
              Pending: {$sum: '$PendingSum'},
              TransferIn: {$sum: '$TransferIn'},
              TransferOut: {$sum: '$TransferOut'},
              total: {$sum: 1}
            },
          }]
      );
      context.result = result;
    }
    return context;
  };
};


