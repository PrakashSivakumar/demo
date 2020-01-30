// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const mongoose = require('mongoose');
module.exports = function (options = {}) {
  return async context => {
    let request = context.params.query.$dashboard;

    function findPatinet() {
      // console.log(patient)
      return new Promise((resolve, reject) => {
        context.app.service('patient').find({
          query: {
            'contact.phone': request.patientId,
          }
        }).then(result => {
          if (result.total !== 0) {
            resolve(result.data[0]._id);
          }
        }).catch(err => reject(err));
      });
    }

    let activeRx, historyRxs, activeRxTotal, historyRxsTotal
    const Types = mongoose.Types,
      ObjectId = Types.ObjectId;
    let routeName = request.routeName;
    let patientId = await findPatinet();
    console.log(patientId);
    console.log(request)
    switch (routeName) {
      case 'activeRx':
        activeRxTotal = await context.app.service('rx').Model.aggregate(
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
            {
              $match: {
                $and: [
                  {
                    'refills.fills.status': {
                      $in: ['Billed for Cash', 'Billed for Insurance', null, '']
                    }
                  },
                  {
                    'refills.fills.verificationStatus': {
                      $ne: ['Sold Out', 'Deleted']
                    },
                  },

                  {
                    'patient_id': ObjectId(patientId)

                  }
                ]
              }
            },
            {
              $count: 'total_count'
            },
          ]
        );

        activeRx = await context.app.service('rx').Model.aggregate(
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
            {
              $match: {
                $and: [
                  {
                    'refills.fills.status': {
                      $in: ['Billed for Cash', 'Billed for Insurance', null, '']
                    }
                  },
                  {
                    'refills.fills.verificationStatus': {
                      $ne: ['Sold Out', 'Deleted']
                    },
                  },

                  {
                    'patient_id': ObjectId(patientId)

                  }
                ]
              }
            },
            {
              $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
            },
            {
              $skip: request.pageElements
            },
            {$limit: 4}
          ]
        );
        context.result = {
          total: activeRxTotal[0] === undefined ? 0 : activeRxTotal[0].total_count,
          data: activeRx
        };
        break
      case 'history':
        historyRxsTotal = await context.app.service('rx').Model.aggregate(
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
            {
              $match: {
                $and: [
                  {
                    'refills.fills.status': {
                      $in: ['Billed for Cash', 'Billed for Insurance', null, '']
                    }
                  },
                  {
                    'refills.fills.verificationStatus': {
                      $in: ['Sold Out', 'Deleted']
                    },
                  },
                  {
                    'patient_id': ObjectId(patientId)
                  }
                ]
              }
            },
            {
              $count: 'total_count'
            },
          ]
        );
        historyRxs = await context.app.service('rx').Model.aggregate(
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
            {
              $match: {
                $and: [
                  {
                    'refills.fills.status': {
                      $in: ['Billed for Cash', 'Billed for Insurance', null, '']
                    }
                  },
                  {
                    'refills.fills.verificationStatus': {
                      $in: ['Sold Out', 'Deleted']
                    },
                  },
                  {
                    'patient_id': ObjectId(patientId)
                  }
                ]
              }
            },
            {
              $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
            },
            {
              $skip: request.pageElements
            },
            {$limit: 4}
          ]
        );
        context.result = {
          total: historyRxsTotal[0] === undefined ? 0 : historyRxsTotal[0].total_count,
          data: historyRxs
        };
        break;
    }
    return context;
  };
};
