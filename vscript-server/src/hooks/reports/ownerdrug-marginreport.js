// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const mongoose = require('mongoose');

const Types = mongoose.Types,
  ObjectId = Types.ObjectId;

module.exports = function (options = {}) {
  return async context => {
    console.log(context.data);
    let drugMarginDay;
    if(context.data.toDate==='' || context.data.fromDate === ''){
      drugMarginDay = await context.app.service('rx').Model.aggregate(
        [
          {
            $addFields:
              {

                'refills.fills':
                  {
                    $slice: ['$refills.fills', -1]
                  }
              }
          },
          {$unwind: '$refills.fills'},
          {
            $match: {
              $and: [
                {
                  'refills.fills.status': {
                    $in: ['Billed for Cash', 'Billed for Insurance']
                  }
                },
                {
                  'refills.fills.verificationStatus': {
                    $in: ['Sold Out']
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
              'd': {
                '$dayOfMonth': '$createdAt'
              },
              'drug': '$productDetails.name',
              'Ndc': '$product_id',
              'totalAmount': '$refills.fills.billing.totalPaid',
              'totalMargin': '$refills.fills.billing.profitMargin',
              'quantity': '$refills.fills.quantityDispensed',
              'awp': '$refills.fills.billing.awp',
              'wac': '$refills.fills.billing.wac'
            }
          },

          {
            $group: {
              _id: {
                'drug': '$drug',
                'Ndc': '$Ndc',
                'Day': '$d'
              },
              totalAmount: {$sum: '$totalAmount'},
              totalMargin: {$sum: '$totalMargin'},
              quantity: {$sum: '$quantity'},
              awp: {$first: '$awp'},
              wac: {$first: '$wac'}
            },
          }
        ]
      );
      context.result = drugMarginDay;
      return context;
    }else{
      switch (context.data.frequency) {
        case 'Daily':
          drugMarginDay = await context.app.service('rx').Model.aggregate(
            [
              {
                $addFields:
                  {

                    'refills.fills':
                      {
                        $slice: ['$refills.fills', -1]
                      }
                  }
              },
              {$unwind: '$refills.fills'},
              {
                $match: {
                  $and: [
                    {
                      'refills.fills.status': {
                        $in: ['Billed for Cash', 'Billed for Insurance']
                      }
                    },
                    {
                      'refills.fills.verificationStatus': {
                        $in: ['Sold Out']
                      }
                    },
                    {
                      'createdAt': {
                        $lt: new Date(new Date(context.data.toDate).getFullYear(), new Date(context.data.toDate).getMonth(), new Date(context.data.toDate).getDate() + 1),

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
                  'd': {
                    '$dayOfMonth': '$createdAt'
                  },
                  'drug': '$productDetails.name',
                  'Ndc': '$product_id',
                  'totalAmount': '$refills.fills.billing.totalPaid',
                  'totalMargin': '$refills.fills.billing.profitMargin',
                  'quantity': '$refills.fills.quantityDispensed',
                  'awp': '$refills.fills.billing.awp',
                  'wac': '$refills.fills.billing.wac'
                }
              },

              {
                $group: {
                  _id: {
                    'drug': '$drug',
                    'Ndc': '$Ndc',
                    'Day': '$d'
                  },
                  totalAmount: {$sum: '$totalAmount'},
                  totalMargin: {$sum: '$totalMargin'},
                  quantity: {$sum: '$quantity'},
                  awp: {$first: '$awp'},
                  wac: {$first: '$wac'}
                },
              }
            ]
          );
          context.result = drugMarginDay;
          return context;

          break;
        case 'Weekly':
          drugMarginDay = await context.app.service('rx').Model.aggregate(
            [
              {
                $addFields:
                  {

                    'refills.fills':
                      {
                        $slice: ['$refills.fills', -1]
                      }
                  }
              },
              {$unwind: '$refills.fills'},
              {
                $match: {
                  $and: [
                    {
                      'refills.fills.status': {
                        $in: ['Billed for Cash', 'Billed for Insurance']
                      }
                    },
                    {
                      'createdAt': {
                        $lt: new Date(new Date(context.data.toDate).getFullYear(), new Date(context.data.toDate).getMonth(), new Date(context.data.toDate).getDate() + 1),

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
                  'w': {
                    '$week': '$createdAt'
                  },
                  'drug': '$productDetails.name',
                  'Ndc': '$product_id',
                  'totalAmount': '$refills.fills.billing.totalPaid',
                  'totalMargin': '$refills.fills.billing.profitMargin',
                  'quantity': '$refills.fills.quantityDispensed',
                  'awp': '$refills.fills.billing.awp',
                  'wac': '$refills.fills.billing.wac'
                }
              },

              {
                $group: {
                  _id: {
                    'drug': '$drug',
                    'Ndc': '$Ndc',
                    'week': '$w'
                  },
                  totalAmount: {$sum: '$totalAmount'},
                  totalMargin: {$sum: '$totalMargin'},
                  quantity: {$sum: '$quantity'},
                  awp: {$first: '$awp'},
                  wac: {$first: '$wac'}
                },
              }
            ]
          );
          context.result = drugMarginDay;
          return context;

          break;
        case 'Monthly':
          drugMarginDay = await context.app.service('rx').Model.aggregate(
            [
              {
                $addFields:
                  {

                    'refills.fills':
                      {
                        $slice: ['$refills.fills', -1]
                      }
                  }
              },
              {$unwind: '$refills.fills'},
              {
                $match: {
                  $and: [
                    {
                      'refills.fills.status': {
                        $in: ['Billed for Cash', 'Billed for Insurance']
                      }
                    },
                    {
                      'createdAt': {
                        $lt: new Date(new Date(context.data.toDate).getFullYear(), new Date(context.data.toDate).getMonth(), new Date(context.data.toDate).getDate() + 1),

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
                  'm': {
                    '$month': '$createdAt'
                  },
                  'drug': '$productDetails.name',
                  'Ndc': '$product_id',
                  'totalAmount': '$refills.fills.billing.totalPaid',
                  'totalMargin': '$refills.fills.billing.profitMargin',
                  'quantity': '$refills.fills.quantityDispensed',
                  'awp': '$refills.fills.billing.awp',
                  'wac': '$refills.fills.billing.wac'
                }
              },

              {
                $group: {
                  _id: {
                    'drug': '$drug',
                    'Ndc': '$Ndc',
                    'month': '$m'
                  },
                  totalAmount: {$sum: '$totalAmount'},
                  totalMargin: {$sum: '$totalMargin'},
                  quantity: {$sum: '$quantity'},
                  awp: {$first: '$awp'},
                  wac: {$first: '$wac'}
                },
              }
            ]
          );
          context.result = drugMarginDay;
          return context;

          break;
        case 'Yearly':
          drugMarginDay = await context.app.service('rx').Model.aggregate(
            [
              {
                $addFields:
                  {

                    'refills.fills':
                      {
                        $slice: ['$refills.fills', -1]
                      }
                  }
              },
              {$unwind: '$refills.fills'},
              {
                $match: {
                  $and: [
                    {
                      'refills.fills.status': {
                        $in: ['Billed for Cash', 'Billed for Insurance']
                      }
                    },
                    {
                      'createdAt': {
                        $lt: new Date(new Date(context.data.toDate).getFullYear(), new Date(context.data.toDate).getMonth(), new Date(context.data.toDate).getDate() + 1),

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
                  'drug': '$productDetails.name',
                  'Ndc': '$product_id',
                  'totalAmount': '$refills.fills.billing.totalPaid',
                  'totalMargin': '$refills.fills.billing.profitMargin',
                  'quantity': '$refills.fills.quantityDispensed',
                  'awp': '$refills.fills.billing.awp',
                  'wac': '$refills.fills.billing.wac'
                }
              },

              {
                $group: {
                  _id: {
                    'drug': '$drug',
                    'Ndc': '$Ndc',
                    'year': '$y'
                  },
                  totalAmount: {$sum: '$totalAmount'},
                  totalMargin: {$sum: '$totalMargin'},
                  quantity: {$sum: '$quantity'},
                  awp: {$first: '$awp'},
                  wac: {$first: '$wac'}
                },
              }
            ]
          );
          context.result = drugMarginDay;
          return context;
          break;
      }
    }

  };
};
