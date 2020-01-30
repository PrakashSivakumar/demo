const mongoose = require('mongoose');
const Types = mongoose.Types,
  ObjectId = Types.ObjectId;
module.exports = function (options = {}) {
  return async context => {

    let total, data;
    if (context.params.query.$dashboard) {
      if (context.params.user.roles.includes('pharmacist') && context.params.user.details.pharmacy_id.length > 1) {
        let request = context.params.query.$dashboard;
        let routeName = request.routeName;

        switch (routeName) {
          case 'activebin':

            let today = new Date(), before1 = Date.parse(today.getDate() - 1);
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $or: [{
                      $and: [{
                        $or: [
                          {
                            'refills.fills.status': {
                              $in: ['Billed for Cash', 'Billed for Insurance', 'Insurance Denied', 'Refund', 'Unbilled', 'Hold', 'Transfer In', '']
                            }
                          },
                          {
                            'refills.fills.verificationStatus': {
                              $in: [null, 'Pending', 'Approved', 'Rejected', '', 'Cancelled Rx']
                            }
                          },
                        ],
                      },
                        {
                          'refills.fills.status': {
                            $nin: ['Deleted']
                          }
                        },
                        {
                          'updatedAt': {
                            $lte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 4)
                          }
                        },
                        {
                          'refills.fills.rxOriginCode': {
                            $nin: ['MyRx']
                          },
                        },
                        {
                          'pharmacy_id': {
                            $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                              (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                          }
                        },
                      ]
                    },
                      {
                        // 'refills.fills.verficationStatus': 'Sold Out',

                        'updatedAt':
                          {
                            $lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
                          },
                      }]

                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                    $or: [{
                      $and: [{
                        $or: [
                          {
                            'refills.fills.status': {
                              $in: ['Billed for Cash', 'Billed for Insurance', 'Insurance Denied', 'Refund', 'Unbilled', 'Hold', 'Transfer In', '']
                            }
                          },
                          {
                            'refills.fills.verificationStatus': {
                              $in: [null, 'Pending', 'Approved', 'Rejected', '', 'Cancelled Rx']
                            },
                          }]
                      },
                        {
                          'refills.fills.status': {
                            $nin: ['Deleted']
                          }
                        },
                        {
                          'updatedAt': {
                            $lte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 4)
                          }
                        },
                        {
                          'pharmacy_id': {
                            $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                              (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                          }
                        },
                      ],
                    },
                      {
                        // 'refills.fills.verficationStatus': 'Sold Out',
                        'updatedAt': {
                          $lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),
                          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
                        },
                      }],
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + 1)},
                },
                {
                  $skip: request.pageElements
                },
                // {
                //   $count: 'total_count'
                // },
                {$limit: 4},

              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'incomerx':
            let todayincome = new Date(), beforeincome = Date.parse(todayincome.getDate() - 1);
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $or: [{
                      $and: [
                        {
                          'refills.fills.rxOriginCode': {
                            $in: ['MyRx', 'E-Prescription','eFax']
                          },
                          'rxType': {
                            $in: ['eFax', 'myrx', 'surescripts', 'external', 'eFax']
                          }
                        },
                        {
                          'pharmacy_id': {
                            $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                              (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                          }
                        },
                      ]
                    }]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $or: [{
                      $and: [
                        {
                          'refills.fills.rxOriginCode': {
                            $in: ['MyRx', 'E-Prescription', 'eFax']
                          },
                          'rxType': {
                            $in: ['eFax', 'myrx', 'surescripts', 'external']
                          }
                        },
                        {
                          'pharmacy_id': {
                            $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                              (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                          }
                        },
                      ],
                    }],
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + 1)},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: 6}
                /* {$limit: context.app.get('paginate').default}*/
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'report-digital-sign':
            if (request.controlled === true) {
              if (request.fromDate === '' || request.toDate === '') {
                total = await context.app.service('rx').Model.aggregate([
                  {
                    $match: {
                      $and: [
                        {
                          'rxType': {
                            $ne: 'myrx'
                          }
                        },
                        {
                          'productDetails.DEAClass': {
                            $nin: [6, null]
                          },
                        },
                        {
                          'pharmacy_id': {
                            $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                              (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                          }
                        }
                      ]
                    },
                  },
                  {
                    $count: 'total_count'
                  }
                ]);
                data = await context.app.service('rx').Model.aggregate([
                  {
                    $match: {
                      $and: [
                        {
                          'rxType': {
                            $ne: 'myrx'
                          }
                        },
                        {
                          'productDetails.DEAClass': {
                            $nin: [6, null]
                          },
                        },
                        {
                          'pharmacy_id': {
                            $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                              (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                          }
                        }
                      ]
                    },
                  },
                  {
                    $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                  },
                  {
                    $skip: request.pageElements
                  },
                  {$limit: context.app.get('paginate').default},
                ]);
                context.result = {
                  total: total[0] === undefined ? 0 : total[0].total_count,
                  data: data
                };
              } else {
                total = await context.app.service('rx').Model.aggregate([
                  {
                    $match: {
                      $and: [
                        {
                          'rxType': {
                            $ne: 'myrx'
                          }
                        },
                        {
                          'productDetails.DEAClass': {
                            $nin: [6, null]
                          },
                        },
                        {
                          'updatedAt': {
                            $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
                            $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate())
                          }
                        },
                        {
                          'pharmacy_id': {
                            $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                              (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                          }
                        },
                      ]
                    }
                  },
                  {
                    $count: 'total_count'
                  },
                ]);
                data = await context.app.service('rx').Model.aggregate([
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
                          'rxType': {
                            $ne: 'myrx'
                          }
                        },
                        {
                          'productDetails.DEAClass': {
                            $nin: [6, null]
                          },
                        },
                        {
                          'updatedAt': {
                            $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
                            $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate())
                          }
                        },
                        {
                          'pharmacy_id': {
                            $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                              (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                          }
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
                  {$limit: context.app.get('paginate').default},
                ]);
                context.result = {
                  total: total[0] === undefined ? 0 : total[0].total_count,
                  data: data
                };
              }
            }
            else if (request.controlled === false) {
              if (request.fromDate === '' || request.toDate === '') {
                total = await context.app.service('rx').Model.aggregate([
                  {
                    $match: {
                      $and: [
                        {
                          'rxType': {
                            $ne: 'myrx'
                          }
                        },
                        {
                          'pharmacy_id': {
                            $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                              (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                          }
                        }
                      ]
                    },
                  },
                  {
                    $count: 'total_count'
                  }
                ]);
                data = await context.app.service('rx').Model.aggregate([
                  {
                    $match: {
                      $and: [
                        {
                          'rxType': {
                            $ne: 'myrx'
                          }
                        },
                        {
                          'pharmacy_id': {
                            $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                              (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                          }
                        }
                      ]
                    },
                  },
                  {
                    $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                  },
                  {
                    $skip: request.pageElements
                  },
                  {$limit: context.app.get('paginate').default},
                ]);
                context.result = {
                  total: total[0] === undefined ? 0 : total[0].total_count,
                  data: data
                };
              } else {
                total = await context.app.service('rx').Model.aggregate([
                  {
                    $match: {
                      $and: [
                        {
                          'rxType': {
                            $ne: 'myrx'
                          }
                        },
                        {
                          'updatedAt': {
                            $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
                            $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate())
                          }
                        },
                        {
                          'pharmacy_id': {
                            $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                              (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                          }
                        },
                      ]
                    }
                  },
                  {
                    $count: 'total_count'
                  },
                ]);
                data = await context.app.service('rx').Model.aggregate([
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
                          'rxType': {
                            $ne: 'myrx'
                          }
                        },
                        {
                          'updatedAt': {
                            $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
                            $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate())
                          }
                        },
                        {
                          'pharmacy_id': {
                            $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                              (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                          }
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
                  {$limit: context.app.get('paginate').default},
                ]);
                context.result = {
                  total: total[0] === undefined ? 0 : total[0].total_count,
                  data: data
                };
              }
            }

            // switch (request.controlled) {
            //   case true:
            //     console.log('case true', request.controlled, request.fromDate, request.toDate);
            //     if (request.fromDate === '' || request.toDate === '') {
            //       total = await context.app.service('rx').Model.aggregate([
            //         {
            //           $match: {
            //             $and: [
            //               {
            //                 'rxType': {
            //                   $ne: 'myrx'
            //                 }
            //               },
            //               {
            //                 'productDetails.DEAClass': {
            //                   $nin: [6, null]
            //                 },
            //               },
            //               {
            //                 'pharmacy_id': {
            //                   $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
            //                     (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
            //                 }
            //               }
            //             ]
            //           },
            //         },
            //         {
            //           $count: 'total_count'
            //         }
            //       ]);
            //       data = await context.app.service('rx').Model.aggregate([
            //         {
            //           $match: {
            //             $and: [
            //               {
            //                 'rxType': {
            //                   $ne: 'myrx'
            //                 }
            //               },
            //               {
            //                 'productDetails.DEAClass': {
            //                   $nin: [6, null]
            //                 },
            //               },
            //               {
            //                 'pharmacy_id': {
            //                   $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
            //                     (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
            //                 }
            //               }
            //             ]
            //           },
            //         },
            //         {
            //           $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
            //         },
            //         {
            //           $skip: request.pageElements
            //         },
            //         {$limit: context.app.get('paginate').default},
            //       ]);
            //       context.result = {
            //         total: total[0] === undefined ? 0 : total[0].total_count,
            //         data: data
            //       };
            //     }
            //     else {
            //       total = await context.app.service('rx').Model.aggregate([
            //         {
            //           $match: {
            //             $and: [
            //               {
            //                 'rxType': {
            //                   $ne: 'myrx'
            //                 }
            //               },
            //               {
            //                 'productDetails.DEAClass': {
            //                   $nin: [6, null]
            //                 },
            //               },
            //               {
            //                 'updatedAt': {
            //                   $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
            //                   $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate())
            //                 }
            //               },
            //               {
            //                 'pharmacy_id': {
            //                   $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
            //                     (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
            //                 }
            //               },
            //             ]
            //           }
            //         },
            //         {
            //           $count: 'total_count'
            //         },
            //       ]);
            //       data = await context.app.service('rx').Model.aggregate([
            //         {
            //           $addFields:
            //             {
            //
            //               'refills.fills':
            //                 {
            //                   $slice: ['$refills.fills', -1]
            //                 }
            //             }
            //         },
            //         {
            //           $match: {
            //             $and: [
            //               {
            //                 'rxType': {
            //                   $ne: 'myrx'
            //                 }
            //               },
            //               {
            //                 'productDetails.DEAClass': {
            //                   $nin: [6, null]
            //                 },
            //               },
            //               {
            //                 'updatedAt': {
            //                   $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
            //                   $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate())
            //                 }
            //               },
            //               {
            //                 'pharmacy_id': {
            //                   $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
            //                     (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
            //                 }
            //               }
            //             ]
            //           }
            //         },
            //         {
            //           $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
            //         },
            //         {
            //           $skip: request.pageElements
            //         },
            //         {$limit: context.app.get('paginate').default},
            //       ]);
            //       context.result = {
            //         total: total[0] === undefined ? 0 : total[0].total_count,
            //         data: data
            //       };
            //     }
            //     break;
            //   case false:
            //     console.log('case false', request.controlled, request.fromDate, request.toDate);
            //     if (request.fromDate === '' || request.toDate === '') {
            //       total = await context.app.service('rx').Model.aggregate([
            //         {
            //           $match: {
            //             $and: [
            //               {
            //                 'rxType': {
            //                   $ne: 'myrx'
            //                 }
            //               },
            //               {
            //                 'pharmacy_id': {
            //                   $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
            //                     (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
            //                 }
            //               }
            //             ]
            //           },
            //         },
            //         {
            //           $count: 'total_count'
            //         }
            //       ]);
            //       data = await context.app.service('rx').Model.aggregate([
            //         {
            //           $match: {
            //             $and: [
            //               {
            //                 'rxType': {
            //                   $ne: 'myrx'
            //                 }
            //               },
            //               {
            //                 'pharmacy_id': {
            //                   $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
            //                     (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
            //                 }
            //               }
            //             ]
            //           },
            //         },
            //         {
            //           $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
            //         },
            //         {
            //           $skip: request.pageElements
            //         },
            //         {$limit: context.app.get('paginate').default},
            //       ]);
            //       context.result = {
            //         total: total[0] === undefined ? 0 : total[0].total_count,
            //         data: data
            //       };
            //     }
            //     else {
            //       total = await context.app.service('rx').Model.aggregate([
            //         {
            //           $match: {
            //             $and: [
            //               {
            //                 'rxType': {
            //                   $ne: 'myrx'
            //                 }
            //               },
            //               {
            //                 'updatedAt': {
            //                   $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
            //                   $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate())
            //                 }
            //               },
            //               {
            //                 'pharmacy_id': {
            //                   $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
            //                     (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
            //                 }
            //               },
            //             ]
            //           }
            //         },
            //         {
            //           $count: 'total_count'
            //         },
            //       ]);
            //       data = await context.app.service('rx').Model.aggregate([
            //         {
            //           $addFields:
            //             {
            //
            //               'refills.fills':
            //                 {
            //                   $slice: ['$refills.fills', -1]
            //                 }
            //             }
            //         },
            //         {
            //           $match: {
            //             $and: [
            //               {
            //                 'rxType': {
            //                   $ne: 'myrx'
            //                 }
            //               },
            //               {
            //                 'updatedAt': {
            //                   $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
            //                   $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate())
            //                 }
            //               },
            //               {
            //                 'pharmacy_id': {
            //                   $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
            //                     (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
            //                 }
            //               }
            //             ]
            //           }
            //         },
            //         {
            //           $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
            //         },
            //         {
            //           $skip: request.pageElements
            //         },
            //         {$limit: context.app.get('paginate').default},
            //       ]);
            //       context.result = {
            //         total: total[0] === undefined ? 0 : total[0].total_count,
            //         data: data
            //       };
            //     }
            //     break;
            // }

            // if (request.fromDate === '' || request.toDate === '') {
            //   total = await context.app.service('rx').Model.aggregate([
            //     {
            //       $match: {
            //         $and: [
            //           {
            //             'rxType': {
            //               $ne: 'myrx'
            //             }
            //           },
            //           {
            //             'pharmacy_id': {
            //               $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
            //                 (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
            //             }
            //           }
            //         ]
            //       },
            //     },
            //     {
            //       $count: 'total_count'
            //     }
            //   ]);
            //   data = await context.app.service('rx').Model.aggregate([
            //     {
            //       $match: {
            //         $and: [
            //           {
            //             'rxType': {
            //               $ne: 'myrx'
            //             }
            //           },
            //           {
            //             'pharmacy_id': {
            //               $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
            //                 (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
            //             }
            //           }
            //         ]
            //       },
            //     },
            //     {
            //       $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
            //     },
            //     {
            //       $skip: request.pageElements
            //     },
            //     {$limit: context.app.get('paginate').default},
            //   ]);
            //   context.result = {
            //     total: total[0] === undefined ? 0 : total[0].total_count,
            //     data: data
            //   };
            // }
            // else {
            //   total = await context.app.service('rx').Model.aggregate([
            //     {
            //       $match: {
            //         $and: [
            //           {
            //             'rxType': {
            //               $ne: 'myrx'
            //             }
            //           },
            //           {
            //             'updatedAt': {
            //               $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
            //               $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate())
            //             }
            //           },
            //           {
            //             'pharmacy_id': {
            //               $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
            //                 (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
            //             }
            //           },
            //         ]
            //       }
            //     },
            //     {
            //       $count: 'total_count'
            //     },
            //   ]);
            //   data = await context.app.service('rx').Model.aggregate([
            //     {
            //       $addFields:
            //         {
            //
            //           'refills.fills':
            //             {
            //               $slice: ['$refills.fills', -1]
            //             }
            //         }
            //     },
            //     {
            //       $match: {
            //         $and: [
            //           {
            //             'rxType': {
            //               $ne: 'myrx'
            //             }
            //           },
            //           {
            //             'updatedAt': {
            //               $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
            //               $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate())
            //             }
            //           },
            //           {
            //             'pharmacy_id': {
            //               $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
            //                 (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
            //             }
            //           }
            //         ]
            //       }
            //     },
            //     {
            //       $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
            //     },
            //     {
            //       $skip: request.pageElements
            //     },
            //     {$limit: context.app.get('paginate').default},
            //   ]);
            //   context.result = {
            //     total: total[0] === undefined ? 0 : total[0].total_count,
            //     data: data
            //   };
            // }
            break;
          case 'reports-controlled':
            total = await context.app.service('rx').Model.aggregate([
              {
                $match: {
                  $and: [
                    {
                      'rxType': {
                        $ne: 'myrx'
                      }
                    },
                    {
                      'productDetails.DEAClass': {
                        $nin: [6, null]
                      },
                    },
                    {
                      'pharmacy_id': {
                        $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                          (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                      }
                    }
                  ]
                },
              },
              {
                $count: 'total_count'
              }
            ]);
            data = await context.app.service('rx').Model.aggregate([
              {
                $match: {
                  $and: [
                    {
                      'rxType': {
                        $ne: 'myrx'
                      }
                    },
                    {
                      'productDetails.DEAClass': {
                        $nin: [6, null]
                      },
                    },
                    {
                      'pharmacy_id': {
                        $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                          (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                      }
                    }
                  ]
                },
              },
              {
                $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
              },
              {
                $skip: request.pageElements
              },
              {$limit: context.app.get('paginate').default},
            ]);
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'recycle':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'refills.fills.status': {
                          $in: ['Deleted', 'Restocked']
                        }
                      },

                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Deleted', 'Restocked']
                        }
                      },

                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}


              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'fill':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'refills.fills.status': {
                          $in: ['Billed for Cash', 'Billed for Insurance', 'Transfer Out']
                        }
                      },
                      {
                        'refills.fills.verificationStatus': {
                          $in: ['Draft', 'Rejected', null, '']
                        },
                      },
                      {
                        'rxType': {
                          $ne: 'myrx'
                        },
                      },
                      // {
                      //   'refills.fills.rxOriginCode': {
                      //     $nin: ['MyRx']
                      //   },
                      // },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },
              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Billed for Cash', 'Billed for Insurance']
                        }
                      },
                      {
                        'refills.fills.verificationStatus': {
                          $in: ['Draft', 'Rejected', null, '']
                        },
                      },
                      // {
                      //   'refills.fills.rxOriginCode': {
                      //     $nin: ['MyRx']
                      //   },
                      // },
                      {
                        'rxType': {
                          $ne: 'myrx'
                        },
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  // $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                  $sort: {['isPriorty']: -1},
                },
                {
                  $skip: request.pageElements
                },
                // {$limit: 5}
                {$limit: context.app.get('paginate').default}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'fillActive':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'refills.fills.status': {
                          $in: ['Billed for Cash', 'Billed for Insurance', 'Transfer Out']
                        }
                      },
                      {
                        'refills.fills.verificationStatus': {
                          $in: ['Draft', 'Rejected', null, '']
                        },
                      },
                      {
                        'rxType': {
                          $ne: 'myrx'
                        },
                      },
                      // {
                      //   'refills.fills.rxOriginCode': {
                      //     $nin: ['MyRx']
                      //   },
                      // },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },
              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Billed for Cash', 'Billed for Insurance']
                        }
                      },
                      {
                        'refills.fills.verificationStatus': {
                          $in: ['Draft', 'Rejected', null, '']
                        },
                      },
                      // {
                      //   'refills.fills.rxOriginCode': {
                      //     $nin: ['MyRx']
                      //   },
                      // },
                      {
                        'rxType': {
                          $ne: 'myrx'
                        },
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  // $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                  $sort: {['isPriorty']: -1},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: 5}
                //{$limit: context.app.get('paginate').default}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'insurance':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'refills.fills.status': {
                          $in: ['Billed for Insurance', 'Insurance Denied']
                        }
                      },
                      {
                        'refills.fills.verificationStatus': {
                          $in: [null, '']
                        },
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },
              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Billed for Insurance', 'Insurance Denied']
                        }
                      },
                      {
                        'refills.fills.verificationStatus': {
                          $in: [null, '']
                        },
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  // $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                  $sort: {['isPriorty']: -1},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}


              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'verification':
            total = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Pending']
                        },
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Pending']
                        },
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  // $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                  $sort: {['isPriorty']: -1},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}
                // {$limit: 4}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'verificationapproved':
            total = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Approved']
                        },
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Approved']
                        },
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}
                // {$limit: 5}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'verificationapprovedActive':
            total = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Approved']
                        },
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Approved']
                        },
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $skip: request.pageElements
                },
                //{$limit: context.app.get('paginate').default}
                {$limit: 5}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'checkOut':
            total = await context.app.service('rx').Model.aggregate(
              [
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
                          $in: ['Approved', 'Release', 'Viewed by Patient']
                        },
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Approved', 'Release', 'Viewed by Patient']
                        },
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $group: {
                    _id: {
                      'patient': '$patient_id',
                    },
                  },
                }
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'ApprovedPatientData':
            total = await context.app.service('rx').Model.aggregate(
              [
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
                          $in: ['Approved', 'Release', 'Viewed by Patient']
                        },
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Approved', 'Release', 'Viewed by Patient']
                        },
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                      {
                        'patient_id': ObjectId(request.patientId)

                      }
                    ]
                  }
                },
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data,
              viewed: 'ApprovedPatientData'
            };
            break;
          case 'verificationPharmacist':
            total = await context.app.service('rx').Model.aggregate(
              [
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
                          $in: ['Pending']
                        },
                      },
                      {
                        'pharmacy_id': ObjectId(context.params.query.$dashboard.phamacyId)
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Pending']
                        },
                      },
                      {
                        'pharmacy_id': ObjectId(context.params.query.$dashboard.phamacyId)
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'myrx':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'rxType': {
                          $eq: 'myrx'
                        }
                      },

                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },
                {$limit: 4}
              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                        'rxType': {
                          $eq: 'myrx'
                        }
                      },

                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                      /*{
                        'patient_id': ObjectId(request.patientId)

                      }*/
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
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'controlled':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },

                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },

                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'controlledDate':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },

                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                      {
                        'updatedAt':{
                          $lt: new Date(new Date(request.DateData).getFullYear(), new Date(request.DateData).getMonth(), new Date(request.DateData).getDate() + 1),

                          $gte: new Date(new Date(request.DateData).getFullYear(), new Date(request.DateData).getMonth(), new Date(request.DateData).getDate()),
                        }
                      }
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },

                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                      {
                        'updatedAt':{
                          $lt: new Date(new Date(request.DateData).getFullYear(), new Date(request.DateData).getMonth(), new Date(request.DateData).getDate() + 1),

                          $gte: new Date(new Date(request.DateData).getFullYear(), new Date(request.DateData).getMonth(), new Date(request.DateData).getDate()),
                        }
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
                {$limit: context.app.get('paginate').default}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'controlledPres':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },
                      {
                        'prescriber_id': {
                          $eq: ObjectId(request.prescriber)
                        }
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },
                      {
                        'patient_id': {
                          $eq: ObjectId(request.patientId)
                        }
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'controlledpatient':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },
                      {
                        'patient_id': {
                          $eq: ObjectId(request.patientId)
                        }
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },
                      {
                        'patient_id': {
                          $eq: ObjectId(request.patientId)
                        }
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'controlledrxid':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },
                      {
                        '_id': {
                          $eq: ObjectId(request.rxId)
                        }
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },
                      {
                        '_id': {
                          $eq: ObjectId(request.rxId)
                        }
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'controlledproductid':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },
                      {
                        'productDetails.productName': {
                          $eq: ObjectId(request.productId)
                        }
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },
                      {
                        'productDetails.productName': {
                          $eq: ObjectId(request.productId)
                        }
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
        }
      }
      else {
        let request = context.params.query.$dashboard;
        let routeName = request.routeName;
        switch (routeName) {
          case 'activebin':
            let today = new Date(), before1 = Date.parse(today.getDate() - 1);
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $or: [{
                      $and: [{
                        $or: [
                          {
                            'refills.fills.status': {
                              $in: ['Billed for Cash', 'Billed for Insurance', 'Insurance Denied', 'Refund', 'Unbilled', 'Hold', '']
                            }
                          },
                          {
                            'refills.fills.verificationStatus': {
                              $in: [null, 'Pending', 'Approved', 'Rejected', '', 'Cancelled Rx']
                            }
                          },
                        ],
                      },
                        {
                          'refills.fills.status': {
                            $nin: ['Deleted']
                          }
                        },
                        {
                          'updatedAt': {
                            $lte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 4)
                          }
                        },
                        {
                          'refills.fills.rxOriginCode': {
                            $nin: ['MyRx']
                          },
                        },
                        {
                          'pharmacy_id': ObjectId(request.phamacyId[0])
                        },
                      ]
                    }, {
                      // 'refills.fills.verficationStatus': 'Sold Out',
                      'updatedAt': {
                        $lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),
                        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
                      },
                    }]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
              //           // 'refills.fills.status': {
              //           //   $in: ['Billed for Cash', 'Billed for Insurance', 'Insurance Denied', 'Refund', 'Unbilled', 'Hold']
              //           // },
              //           // 'refills.fills.verificationStatus': {
              //           //   $in: ['Sold Out', null, '']
              //           // },
              //           // $sort: sortDirection + sortColumnName,
              //           // $skip: pageElements
              //
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
                    $or: [{
                      $and: [{
                        $or: [
                          {
                            'refills.fills.status': {
                              $in: ['Billed for Cash', 'Billed for Insurance', 'Insurance Denied', 'Refund', 'Unbilled', 'Hold', '']
                            }
                          },
                          {
                            'refills.fills.verificationStatus': {
                              $in: [null, 'Pending', 'Approved', 'Rejected', '', 'Cancelled Rx']
                            },
                          }]
                      },
                        {
                          'refills.fills.status': {
                            $nin: ['Deleted']
                          }
                        },
                        {
                          'updatedAt': {
                            $lte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),
                            $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 4)
                          }
                        },
                        {
                          'refills.fills.rxOriginCode': {
                            $nin: ['MyRx']
                          },
                        },
                        {
                          'pharmacy_id': ObjectId(request.phamacyId[0])
                        },
                      ],
                    },
                      {
                        // 'refills.fills.verficationStatus': 'Sold Out',
                        'updatedAt': {
                          $lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),
                          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())
                        },
                      }],

                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + 1)},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: 4},

              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'incomerx':
            let todayincome = new Date(), beforeincome = Date.parse(todayincome.getDate() - 1);
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $or: [{
                      $and: [
                        {
                          'refills.fills.rxOriginCode': {
                            $in: ['MyRx', 'E-Prescription','eFax']
                          },
                          'rxType': {
                            $in: ['eFax', 'myrx', 'surescripts', 'external']
                          }
                        },
                        {
                          'pharmacy_id': ObjectId(request.phamacyId[0])
                        },
                      ]
                    }]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                    $or: [{
                      $and: [
                        {
                          'refills.fills.rxOriginCode': {
                            $in: ['MyRx', 'E-Prescription','eFax']
                          },
                          'rxType': {
                            $in: ['eFax', 'myrx', 'surescripts', 'external', 'eFax']
                          }
                        },
                        {
                          'pharmacy_id': ObjectId(request.phamacyId[0])
                        },
                      ],
                    }],
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + 1)},
                },
                {
                  $skip: request.pageElements
                },
                /*{$limit: context.app.get('paginate').default}*/
                {$limit: 6}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'report-digital-sign':
            if (request.controlled === true) {
              if (request.fromDate === '' || request.toDate === '') {
                total = await context.app.service('rx').Model.aggregate([
                  {
                    $match: {
                      $and: [
                        {
                          'rxType': {
                            $ne: 'myrx'
                          }
                        },
                        {
                          'productDetails.DEAClass': {
                            $nin: [6, null]
                          },
                        },
                        {
                          'pharmacy_id': ObjectId(request.phamacyId[0])
                        }
                      ]
                    },
                  },
                  {
                    $count: 'total_count'
                  }
                ]);
                data = await context.app.service('rx').Model.aggregate([
                  {
                    $match: {
                      $and: [
                        {
                          'rxType': {
                            $ne: 'myrx'
                          }
                        },
                        {
                          'productDetails.DEAClass': {
                            $nin: [6, null]
                          },
                        },
                        {
                          'pharmacy_id': ObjectId(request.phamacyId[0])
                        }
                      ]
                    },
                  },
                  {
                    $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                  },
                  {
                    $skip: request.pageElements
                  },
                  {$limit: context.app.get('paginate').default},
                ]);
                context.result = {
                  total: total[0] === undefined ? 0 : total[0].total_count,
                  data: data
                };
              } else {
                total = await context.app.service('rx').Model.aggregate([
                  {
                    $match: {
                      $and: [
                        {
                          'rxType': {
                            $ne: 'myrx'
                          }
                        },
                        {
                          'productDetails.DEAClass': {
                            $nin: [6, null]
                          },
                        },
                        {
                          'updatedAt': {
                            $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
                            $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate())
                          }
                        },
                        {
                          'pharmacy_id': ObjectId(request.phamacyId[0])
                        },
                      ]
                    }
                  },
                  {
                    $count: 'total_count'
                  },
                ]);
                data = await context.app.service('rx').Model.aggregate([
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
                          'rxType': {
                            $ne: 'myrx'
                          }
                        },
                        {
                          'productDetails.DEAClass': {
                            $nin: [6, null]
                          },
                        },
                        {
                          'updatedAt': {
                            $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
                            $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate())
                          }
                        },
                        {
                          'pharmacy_id': ObjectId(request.phamacyId[0])
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
                  {$limit: context.app.get('paginate').default},
                ]);
                context.result = {
                  total: total[0] === undefined ? 0 : total[0].total_count,
                  data: data
                };
              }
            } else if (request.controlled === false) {
               if (request.fromDate === '' || request.toDate === '') {
                total = await context.app.service('rx').Model.aggregate([
                  {
                    $match: {

                      'pharmacy_id': ObjectId(request.phamacyId[0])

                    },
                  },
                  {
                    $count: 'total_count'
                  }
                ]);
                data = await context.app.service('rx').Model.aggregate([
                  {
                    $match: {

                          'pharmacy_id': ObjectId(request.phamacyId[0])

                    },
                  },
                  {
                    $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                  },
                  {
                    $skip: request.pageElements
                  },
                  {$limit: context.app.get('paginate').default},
                ]);
                context.result = {
                  total: total[0] === undefined ? 0 : total[0].total_count,
                  data: data
                };
              } else {
                total = await context.app.service('rx').Model.aggregate([
                  {
                    $match: {
                      $and: [
                        {
                          'createdAt': {
                            $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
                            $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate())
                          }
                        },
                        {
                          'pharmacy_id': ObjectId(request.phamacyId[0])
                        },
                      ]
                    }
                  },
                  {
                    $count: 'total_count'
                  },
                ]);
                data = await context.app.service('rx').Model.aggregate([
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
                          'createdAt': {
                            $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
                            $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate())
                          }
                        },
                        {
                          'pharmacy_id': ObjectId(request.phamacyId[0])
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
                  {$limit: context.app.get('paginate').default},
                ]);
                context.result = {
                  total: total[0] === undefined ? 0 : total[0].total_count,
                  data: data
                };
              }
            }
            break;
          case 'reports-controlled':
            total = await context.app.service('rx').Model.aggregate([
              {
                $match: {
                  $and: [
                    {
                      'rxType': {
                        $ne: 'myrx'
                      }
                    },
                    {
                      'productDetails.DEAClass': {
                        $nin: [6, null]
                      },
                    },
                    {
                      'pharmacy_id': ObjectId(request.phamacyId[0])
                    },
                  ]
                },
              },
              {
                $count: 'total_count'
              }
            ]);
            data = await context.app.service('rx').Model.aggregate([
              {
                $match: {
                  $and: [
                    {
                      'rxType': {
                        $ne: 'myrx'
                      }
                    },
                    {
                      'productDetails.DEAClass': {
                        $nin: [6, null]
                      },
                    },
                    {
                      'pharmacy_id': ObjectId(request.phamacyId[0])
                    },
                  ]
                },
              },
              {
                $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
              },
              {
                $skip: request.pageElements
              },
              {$limit: context.app.get('paginate').default},
            ]);
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'recycle':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'refills.fills.status': {
                          $in: ['Deleted', 'Restocked']
                        }
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Deleted', 'Restocked']
                        }
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}


              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'fill':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'refills.fills.status': {
                          $in: ['Billed for Cash', 'Billed for Insurance', 'Transfer Out']
                        }
                      },
                      {
                        'refills.fills.verificationStatus': {
                          $in: ['Draft', 'Rejected', null, '']
                        },
                      },
                      // {
                      //   'refills.fills.rxOriginCode': {
                      //     $nin: ['MyRx']
                      //   },
                      // },
                      {
                        'rxType': {
                          $ne: 'myrx'
                        },
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Billed for Cash', 'Billed for Insurance']
                        }
                      },
                      {
                        'refills.fills.verificationStatus': {
                          $in: ['Draft', 'Rejected', null, '']
                        },
                      },
                      // {
                      //   'refills.fills.rxOriginCode': {
                      //     $nin: ['MyRx']
                      //   },
                      // },
                      {
                        'rxType': {
                          $ne: 'myrx'
                        },
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  // $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                  $sort: {['isPriorty']: -1},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}
                // {$limit: 5}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'fillActive':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'refills.fills.status': {
                          $in: ['Billed for Cash', 'Billed for Insurance', 'Transfer Out']
                        }
                      },
                      {
                        'refills.fills.verificationStatus': {
                          $in: ['Draft', 'Rejected', null, '']
                        },
                      },
                      {
                        'rxType': {
                          $ne: 'myrx'
                        },
                      },
                      // {
                      //   'refills.fills.rxOriginCode': {
                      //     $nin: ['MyRx']
                      //   },
                      // },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },
              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Billed for Cash', 'Billed for Insurance']
                        }
                      },
                      {
                        'refills.fills.verificationStatus': {
                          $in: ['Draft', 'Rejected', null, '']
                        },
                      },
                      // {
                      //   'refills.fills.rxOriginCode': {
                      //     $nin: ['MyRx']
                      //   },
                      // },
                      {
                        'rxType': {
                          $ne: 'myrx'
                        },
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  // $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                  $sort: {['isPriorty']: -1},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: 5}
                //{$limit: context.app.get('paginate').default}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'insurance':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'refills.fills.status': {
                          $in: ['Billed for Insurance', 'Insurance Denied']
                        }
                      },
                      {
                        'refills.fills.verificationStatus': {
                          $in: [null, '']
                        },
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },
              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Billed for Insurance', 'Insurance Denied']
                        }
                      },
                      {
                        'refills.fills.verificationStatus': {
                          $in: [null, '']
                        },
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  // $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                  $sort: {['isPriorty']: -1},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'verification':
            total = await context.app.service('rx').Model.aggregate(
              [
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
                          $in: ['Pending']
                        },
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Pending']
                        },
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  // $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                  $sort: {['isPriorty']: -1},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}
                // {$limit: 4}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'verificationapproved':
            total = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Approved']
                        },
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },
              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Approved']
                        },
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}
                // {$limit: 5}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'verificationapprovedActive':
            total = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Approved']
                        },
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Approved']
                        },
                      },
                      {
                        'pharmacy_id': {
                          $in: [ObjectId(request.phamacyId[0]), ObjectId(request.phamacyId[1]), (ObjectId(request.phamacyId[2])) ? (ObjectId(request.phamacyId[2])) : '',
                            (ObjectId(request.phamacyId[3])) ? (ObjectId(request.phamacyId[3])) : '', (ObjectId(request.phamacyId[4])) ? (ObjectId(request.phamacyId[4])) : '']
                        }
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $skip: request.pageElements
                },
                //{$limit: context.app.get('paginate').default}
                {$limit: 5}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'checkOut':
            total = await context.app.service('rx').Model.aggregate(
              [
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
                          $in: ['Approved', 'Release', 'Viewed by Patient']
                        },
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Approved', 'Release', 'Viewed by Patient']
                        },
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $group: {
                    _id: {
                      'patient': '$patient_id',
                    },
                  },
                }
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'ApprovedPatientData':
            total = await context.app.service('rx').Model.aggregate(
              [
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
                          $in: ['Approved', 'Release', 'Viewed by Patient']
                        },
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                          $in: ['Approved', 'Release', 'Viewed by Patient']
                        },
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                      {
                        'patient_id': ObjectId(request.patientId)

                      }
                    ]
                  }
                },
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data,
              viewed: 'ApprovedPatientData'
            };
            break;
          case 'myrx':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'rxType': {
                          $eq: 'myrx'
                        }
                      },

                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },
                {$limit: 4}
              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                        'rxType': {
                          $eq: 'myrx'
                        }
                      },

                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
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
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'controlled':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },

                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },

                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'controlledDate':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },

                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                      {
                        'updatedAt':{
                          $lt: new Date(new Date(request.DateData).getFullYear(), new Date(request.DateData).getMonth(), new Date(request.DateData).getDate() + 1),

                          $gte: new Date(new Date(request.DateData).getFullYear(), new Date(request.DateData).getMonth(), new Date(request.DateData).getDate()),
                        }
                      }
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },

                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                      {
                        'updatedAt':{
                          $lt: new Date(new Date(request.DateData).getFullYear(), new Date(request.DateData).getMonth(), new Date(request.DateData).getDate() + 1),

                          $gte: new Date(new Date(request.DateData).getFullYear(), new Date(request.DateData).getMonth(), new Date(request.DateData).getDate()),
                        }
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
                {$limit: context.app.get('paginate').default}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'controlledPres':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },
                      {
                        'prescriber_id': {
                          $eq: ObjectId(request.prescriber)
                        }
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },
                      {
                        'patient_id': {
                          $eq: ObjectId(request.patientId)
                        }
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'controlledpatient':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },
                      {
                        'patient_id': {
                          $eq: ObjectId(request.patientId)
                        }
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },
                      {
                        'patient_id': {
                          $eq: ObjectId(request.patientId)
                        }
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'controlledrxid':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },
                      {
                        '_id': {
                          $eq: ObjectId(request.rxId)
                        }
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },
                      {
                        '_id': {
                          $eq: ObjectId(request.rxId)
                        }
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
          case 'controlledproductid':
            total = await context.app.service('rx').Model.aggregate(
              [
                {
                  $match: {
                    $and: [
                      {
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },
                      {
                        'productDetails.productName': {
                          $eq: ObjectId(request.productId)
                        }
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $count: 'total_count'
                },

              ]
            );
            data = await context.app.service('rx').Model.aggregate(
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
                        'productDetails.DEAClass': {
                          $in: [1, 2, 3, 4, 5]
                        }
                      },
                      {
                        'productDetails.productName': {
                          $eq: ObjectId(request.productId)
                        }
                      },
                      {
                        'pharmacy_id': ObjectId(request.phamacyId[0])
                      },
                    ]
                  }
                },
                {
                  $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
                },
                {
                  $skip: request.pageElements
                },
                {$limit: context.app.get('paginate').default}
              ]
            );
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
            break;
        }
      }
    }
    return context;
  };
};
