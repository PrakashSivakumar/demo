/*module.exports = function (options = {}) {
  return async context => {
    let total, data;
    let request = context.params.query.logs;
    console.log('request', request);
    if (context.params.query.logs) {
      switch (request.routeName) {
        case 'rxDate':
          if (request.fromDate === '' || request.toDate === '') {
            total = await context.app.service('rx-logs').Model.aggregate([

              {
                $count: 'total_count'
              }
            ]);
            data = await context.app.service('rx-logs').Model.aggregate([
              {
                $sort: {[request.columnName]: Number(request.direction + 1)},
              },
              {
                $skip: request.pageElements
              },
              {$limit: 5}

            ]);
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data


            };
            console.log("fff:", data);
          } else {
            total = await context.app.service('rx-logs').Model.aggregate([
              {
                $match: {
                  'createdAt': {
                    $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),

                    $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
                  }
                }
              },
              {
                $count: 'total_count'
              }
            ]);
            console.log('ff', total);
            data = await context.app.service('rx-logs').Model.aggregate([
              {
                $match: {
                  'createdAt': {
                    $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),

                    $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
                  }
                }
              },
              {
                $sort: {[request.columnName]: Number(request.direction + 1)},
              },
              {
                $skip: request.pageElements
              },
              {$limit: 5},

            ]);
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
          }

          break;
        case 'rxNo':
          console.log("sfd", request.rxnumber);
          total = await context.app.service('rx-logs').Model.aggregate([
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

                $or: [
                  {
                    "rxId": parseInt(request.rxnumber)

                  },
                  {
                    'refills.fills.user.username':
                      {
                        $eq: [request.username]
                      },
                  },
                  {
                    "action":
                      {
                        $eq: [request.method]
                      }
                  },

                  {
                    'createdAt': {
                      $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),

                      $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
                    }
                  }
                ]


              }
            },
            {
              $count: 'total_count'
            }

          ]);
          let data1 = await context.app.service('rx-logs').Model.aggregate([
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
                $or: [
                  {
                    "rxId": parseInt(request.rxnumber)
                  },
                  {
                    'refills.fills.user.username':
                      {
                        $eq: [request.username]
                      },
                  },
                  {
                    "action":
                      {
                        $eq: [request.method]
                      }
                  },
                  {
                    'createdAt': {
                      $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),

                      $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
                    }
                  }
                ]

              }
            },
            {
              $sort: {[request.columnName]: Number(request.direction + 1)},
            },
            {
              $skip: request.pageElements
            },
            {$limit: 5}

          ]);

          context.result = {
            total: total[0] === undefined ? 0 : total[0].total_count,
            data: data1,

          };
          break;
        /!*  case '':
            total = await context.app.service('rx-logs').Model.aggregate([

              {
                $count: 'total_count'
              }
            ]);
            data = await context.app.service('rx-logs').Model.aggregate([
              {
                $sort: {[request.columnName]: Number(request.direction + 1)},
              },
              {
                $skip: request.pageElements
              },
              {$limit: 5}

            ]);
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data


            };
            break;*!/

      }

      console.log("fgg", data);
      return context;
    }
    ;
  }
};*/


module.exports = function (options = {}) {
  return async context => {
    let total, data;
   /* if(request.routeName === 'datesearch')
    {
      console.log("hjhgjhg",request.controlsub)
      total10 = await context.app.service('rx-logs').Model.aggregate([
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
            rxId: {$exists: true},
            'productDetails.DEAClass': {$nin: [6, null]},

          }
        },
        {
          $count: 'total_count'
        }

      ]);

      let data10 = await context.app.service('rx-logs').Model.aggregate([
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

            rxId:{$exists:true},
            "productDetails.DEAClass": {$nin: [6, null]}


          },

        },
        {
          $sort: {[request.columnName]: Number(request.direction + 1)},
        },
        {
          $skip: request.pageElements
        },

        {$limit: 200}
      ]);
      context.result = {
        total: total10[0] === undefined ? 0 : total10[0].total_count,
        data: data10,

      };
    }*/
    if (context.params.query.logs) {
      let request = context.params.query.logs;
      console.log('request', request);
    if(request.routeName === 'datesearch') {
      if ((request.fromDate === '' && request.toDate === '')) {
        total = await context.app.service('rx-logs').Model.aggregate([
          {
            $match: {
              'rxType': {
                $nin: ['myrx']
              }
            }
          },
          {
            $group:
              {
                _id: { rxNum: { rxId: '$rxId'} },
                itemsSold: {
                $push:  {
                  rxNumber: '$rxId',
                  updatedAt: '$updatedAt',
                  updateFields: '$updateFields',
                  digitalSignature: '$digitalSignature',
                  refills: '$refills',
                  patient_id: '$patient_id',
                  prescriber_id: '$prescriber_id',
                  productDetails: '$productDetails'
                 }
                }
              }
          },
          {
            $count: 'total_count'
          }
        ]);
        data = await context.app.service('rx-logs').Model.aggregate([
          {
            $match: {
              'rxType': {
                $nin: ['myrx']
              }
            }
          },
          {
            $group:
              {
                _id: { rxNum: { rxId: '$rxId'} },
                itemsSold: {
                  $push:  {
                    rxNumber: '$rxId',
                    updatedAt: '$updatedAt',
                    updateFields: '$updateFields',
                    digitalSignature: '$digitalSignature',
                    refills: '$refills',
                    patient_id: '$patient_id',
                    prescriber_id: '$prescriber_id',
                    productDetails: '$productDetails'
                  }
                }
              }
          },
          {
            $sort: {[request.columnName]: Number(request.direction + 1)},
          },
          {
            $skip: request.pageElements
          },
          {$limit: 50}

        ]);
        context.result = {
          total: total[0] === undefined ? 0 : total[0].total_count,
          data: data
        };
      }else{
        total = await context.app.service('rx-logs').Model.aggregate([
          {
            $match: {
              'createdAt': {
                $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
                $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
              },
              'rxType': {
                $nin: ['myrx']
              }
            }
          },
          {
            $group:
              {
                _id: { rxNum: { rxId: '$rxId'} },
                itemsSold: {
                  $push:  {
                    rxNumber: '$rxId',
                    updatedAt: '$updatedAt',
                    updateFields: '$updateFields',
                    digitalSignature: '$digitalSignature',
                    refills: '$refills',
                    patient_id: '$patient_id',
                    prescriber_id: '$prescriber_id',
                    productDetails: '$productDetails'
                  }
                }
              }
          },
          {
            $count: 'total_count'
          }
        ]);
        data = await context.app.service('rx-logs').Model.aggregate([
          {
            $match: {
              'createdAt': {
                $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
                $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
              },
              'rxType': {
                $nin: ['myrx']
              }
            }
          },
          {
            $group:
              {
                _id: { rxNum: { rxId: '$rxId'} },
                itemsSold: {
                  $push:  {
                    rxNumber: '$rxId',
                    updatedAt: '$updatedAt',
                    updateFields: '$updateFields',
                    digitalSignature: '$digitalSignature',
                    refills: '$refills',
                    patient_id: '$patient_id',
                    prescriber_id: '$prescriber_id',
                    productDetails: '$productDetails'
                  }
                }
              }
          },
          {
            $sort: {[request.columnName]: Number(request.direction + 1)},
          },
          {
            $skip: request.pageElements
          },
          {$limit: 50},

        ]);
        context.result = {
          total: total[0] === undefined ? 0 : total[0].total_count,
          data: data
        };
      }
    }
    /*  else if ((request.username !== null && request.username !== '')&&((request.rxnumber===null||request.rxnumber==='')&&(request.method===null||request.method===''||request.method===undefined)&&(request.fromDate === '' || request.toDate === ''))) {
        console.log("hjhhkjjhk")
        console.log("hhjj", request.username)
        total = await context.app.service('rx-logs').Model.aggregate([
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
              'refills.fills.user.username': request.username
            },

          },
          {
            $count: 'total_count'
          }

        ]);
        let data1 = await context.app.service('rx-logs').Model.aggregate([
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
              'refills.fills.user.username': request.username
            },


          },
          {
            $sort: {[request.columnName]: Number(request.direction + 1)},
          },
          {
            $skip: request.pageElements
          },
          {$limit: 5}

        ]);

        context.result = {
          total: total[0] === undefined ? 0 : total[0].total_count,
          data: data1,

        };

      } else if ((request.method!== null && request.method !== ''&&request.method!==undefined)&&((request.username===null||request.username==='')&&(request.rxnumber===null||request.rxnumber==='')&&(request.fromDate === '' || request.toDate === ''))) {
        console.log("hai", request.method)
        total = await context.app.service('rx-logs').Model.aggregate([
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
              "refills.fills.user.lastAction":request.method
              //"action": request.method
            }
          },
          {
            $count: 'total_count'
          }

        ]);

        let data = await context.app.service('rx-logs').Model.aggregate([
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
              "refills.fills.user.lastAction":request.method
             // "action": request.method

            },

          },
          {
            $sort: {[request.columnName]: Number(request.direction + 1)},
          },
          {
            $skip: request.pageElements
          },
          {$limit: 5}

        ]);

        context.result = {
          total: total[0] === undefined ? 0 : total[0].total_count,
          data: data,

        };
      }else if((request.rxnumber!==null&&request.rxnumber!=='')&&(request.username!==null||request.username!=='')&&(request.method!==''||request.method!==undefined)&&(request.fromDate === '' || request.toDate === '')){

        console.log("b")
      if((request.method===''||request.method===undefined)&&(request.username===''||request.username===null))
      {
        total = await context.app.service('rx-logs').Model.aggregate([
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
              "rxId": parseInt(request.rxnumber)

            },

          },
          {
            $count: 'total_count'
          }

        ]);
        let data1 = await context.app.service('rx-logs').Model.aggregate([
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
              "rxId": parseInt(request.rxnumber)

            },

          },
          {
            $sort: {[request.columnName]: Number(request.direction + 1)},
          },
          {
            $skip: request.pageElements
          },
          {$limit: 5}

        ]);

        context.result = {
          total: total[0] === undefined ? 0 : total[0].total_count,
          data: data1,

        };
      }
        else if(request.method===''||request.method===undefined)
        {
          total = await context.app.service('rx-logs').Model.aggregate([
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
                    "rxId": parseInt(request.rxnumber)

                  },
                  {
                    'refills.fills.user.username': request.username
                  },

                ]
              }
            },
            {
              $count: 'total_count'
            }

          ]);

          let data1 = await context.app.service('rx-logs').Model.aggregate([
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
                    "rxId": parseInt(request.rxnumber)

                  },
                  {
                    'refills.fills.user.username': request.username
                  },

                ]
              },

            },
            {
              $sort: {[request.columnName]: Number(request.direction + 1)},
            },
            {
              $skip: request.pageElements
            },
            {$limit: 5}

          ]);
          context.result = {
            total: total[0] === undefined ? 0 : total[0].total_count,
            data: data1,

          };
        }else if(request.username===''||request.username===null)
        {
          total = await context.app.service('rx-logs').Model.aggregate([
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
                    "rxId": parseInt(request.rxnumber)

                  },

                  {
                    "refills.fills.user.lastAction":request.method
                  }
                ]
              }
            },
            {
              $count: 'total_count'
            }

          ]);

          let data1 = await context.app.service('rx-logs').Model.aggregate([
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
                    "rxId": parseInt(request.rxnumber)

                  },

                  {
                    "refills.fills.user.lastAction":request.method
                  }
                ]
              },

            },
            {
              $sort: {[request.columnName]: Number(request.direction + 1)},
            },
            {
              $skip: request.pageElements
            },
            {$limit: 5}

          ]);
          context.result = {
            total: total[0] === undefined ? 0 : total[0].total_count,
            data: data1,

          };
        }else{
          total = await context.app.service('rx-logs').Model.aggregate([
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
                    "rxId": parseInt(request.rxnumber)

                  },
                  {
                    'refills.fills.user.username': request.username
                  },
                  {
                    "refills.fills.user.lastAction":request.method
                  }
                ]
              }
            },
            {
              $count: 'total_count'
            }

          ]);

          let data1 = await context.app.service('rx-logs').Model.aggregate([
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
                    "rxId": parseInt(request.rxnumber)

                  },
                  {
                    'refills.fills.user.username': request.username
                  },
                  {
                    "refills.fills.user.lastAction":request.method
                  }
                ]
              },

            },
            {
              $sort: {[request.columnName]: Number(request.direction + 1)},
            },
            {
              $skip: request.pageElements
            },
            {$limit: 5}

          ]);
          context.result = {
            total: total[0] === undefined ? 0 : total[0].total_count,
            data: data1,

          };
        }
      }else if(((request.username!==null||request.username!=='')&&(request.method!==null||request.method!==''||request.method!==undefined)&&(request.fromDate === '' || request.toDate === '')))
      {
        console.log("c")
        total = await context.app.service('rx-logs').Model.aggregate([
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
                  'refills.fills.user.username': request.username
                },
                {
                  "refills.fills.user.lastAction":request.method
                }
              ]
            }
          },
          {
            $count: 'total_count'
          }

        ]);

        let data1 = await context.app.service('rx-logs').Model.aggregate([
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
                  'refills.fills.user.username': request.username
                },
                {
                  "refills.fills.user.lastAction":request.method
                }
              ]
            },

          },
          {
            $sort: {[request.columnName]: Number(request.direction + 1)},
          },
          {
            $skip: request.pageElements
          },
          {$limit: 5}

        ]);
        context.result = {
          total: total[0] === undefined ? 0 : total[0].total_count,
          data: data1,

        };
      }
      else
      {
        console.log("f")
        total = await context.app.service('rx-logs').Model.aggregate([
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
              'createdAt': {
                $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),

                $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
              }
            }
          },
          {
            $count: 'total_count'
          }

        ]);

        let data1 = await context.app.service('rx-logs').Model.aggregate([
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
              'createdAt': {
                $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),

                $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
              }

            },

          },
          {
            $sort: {[request.columnName]: Number(request.direction + 1)},
          },
          {
            $skip: request.pageElements
          },
          {$limit: 5}

        ]);
        context.result = {
          total: total[0] === undefined ? 0 : total[0].total_count,
          data: data1,

        };

      }*/
      return context;
    }
  };
  }

