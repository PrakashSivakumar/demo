// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) {
  return async context => {
    console.log('params', context.data.rxDate);
    let cashresult, insuranceresult, insuranceDenied, rxCount, refillCount;
    let insurance = [{
      _id: {
        StoreId: null,
        Status: 'Billed for Insurance'
      },
      InsuranceCount: 0,
      InsuranceAmount: 0,
      InsuranceMargin: 0
    }]
    let cash = [{
      _id: {
        StoreId: null,
        Status: 'Billed for Cash'
      },
      CashCount: 0,
      CashAmount: 0,
      CashMargin: 0
    }]
    let denied = [{
      _id: {
        StoreId: null,
        Status: 'Insurance Denied'
      },
      DeniedCount: 0,
    }]
    let rx = [{
      _id: {
        StoreId: null,
      },
      rxCount: 0,
      rxAmount: 0,
      rxMargin: 0,
      rxRefillCounts: 0
    }]
    let refillrx = [{
      _id: {
        StoreId: null,
      },
      rxRefillCount: 0
    }]
    cashresult = await context.app.service('rx').Model.aggregate(
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
                  $eq: 'Billed for Cash'
                }
              },
              {
                'refills.fills.verificationStatus': {
                  $eq: 'Sold Out'
                }
              },
              {
                'updatedAt': {
                  $lt: context.data.rxDate === 'Today' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1) :
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),

                  $gte: context.data.rxDate === 'YesterDay' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1) :
                    context.data.rxDate === 'Week' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7) :
                      context.data.rxDate === 'Month' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 31) :
                        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                }
              }
            ]
          }
        },
        {
          $group: {
            _id: {
              'StoreId': '$pharmacy_id',
              'Status': '$refills.fills.status'
            },
            CashCount: {$sum: 1},
            CashAmount: {$sum: '$refills.fills.billing.totalPaid'},
            CashMargin: {$sum: '$refills.fills.billing.profitMargin'}
          },
        }
      ]
    );
    insuranceresult = await context.app.service('rx').Model.aggregate(
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
                  $eq: 'Billed for Insurance'
                }
              },
              {
                'refills.fills.verificationStatus': {
                  $eq: 'Sold Out'
                }
              },
              {
                'updatedAt': {
                  $lt: context.data.rxDate === 'Today' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1) :
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),

                  $gte: context.data.rxDate === 'YesterDay' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1) :
                    context.data.rxDate === 'Week' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7) :
                      context.data.rxDate === 'Month' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 30) :
                        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                }
              }
            ]
          }
        },
        {
          $group: {
            _id: {
              'StoreId': '$pharmacy_id',
              'Status': '$refills.fills.status'
            },
            InsuranceCount: {$sum: 1},
            InsuranceAmount: {$sum: '$refills.fills.billing.totalPaid'},
            InsuranceMargin: {$sum: '$refills.fills.billing.profitMargin'}
          },
        }
      ]
    );
    insuranceDenied = await context.app.service('rx').Model.aggregate(
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
                  $eq: 'Insurance Denied'
                }
              },

              {
                'updatedAt': {
                  $lt: context.data.rxDate === 'Today' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1) :
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),

                  $gte: context.data.rxDate === 'YesterDay' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1) :
                    context.data.rxDate === 'Week' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7) :
                      context.data.rxDate === 'Month' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 30) :
                        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                }
              }
            ]
          }
        },

        {
          $group: {
            _id: {
              'StoreId': '$pharmacy_id',
              'Status': '$refills.fills.status'
            },
            DeniedCount: {$sum: 1},
          },
        }
      ]
    );
    rxCount = await context.app.service('rx').Model.aggregate(
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
                  $eq: 'Sold Out'
                }
              },
              {
                'updatedAt': {
                  $lt: context.data.rxDate === 'Today' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1) :
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),

                  $gte: context.data.rxDate === 'YesterDay' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1) :
                    context.data.rxDate === 'Week' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7) :
                      context.data.rxDate === 'Month' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 30) :
                        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                }
              }
            ]
          }
        },

        {
          $group: {
            _id: {
              'StoreId': '$pharmacy_id',
            },
            rxCount: {$sum: 1},
            rxAmount: {$sum: '$refills.fills.billing.totalPaid'},
            rxMargin: {$sum: '$refills.fills.billing.profitMargin'},
            rxRefillCounts: {$sum: '$refills.total'}
          },
        }
      ]
    );

    refillCount = await context.app.service('rx').Model.aggregate(
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
                'refills.fills.verificationStatus': {
                  $eq: 'Pending'
                }
              },
              {
                'updatedAt': {
                  $lt: context.data.rxDate === 'Today' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1) :
                    new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),

                  $gte: context.data.rxDate === 'YesterDay' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1) :
                    context.data.rxDate === 'Week' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 7) :
                      context.data.rxDate === 'Month' ? new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 30)  :
                        new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                }
              }
            ]
          }
        },

        {
          $group: {
            _id: {
              'StoreId': '$pharmacy_id'
            },
            rxRefillCount: {$sum: 1},
            // rxAmount: {$sum: '$refills.fills.billing.totalPaid'},
            // rxMargin: {$sum: '$refills.fills.billing.profitMargin'}
          },
        }
      ]
    );

    context.result = {
      cashresult: cashresult[0] === undefined ? cash : cashresult,
      insuranceresult: insuranceresult[0] === undefined ? insurance : insuranceresult,
      insuranceDenied: insuranceDenied[0] === undefined ? denied : insuranceDenied,
      rxCount: rxCount[0] === undefined ? rx : rxCount,
      refillCount: refillCount[0] === undefined ? refillrx : refillCount
    };
    return context;
  };
};
