// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const mongoose = require('mongoose');
const Types = mongoose.Types,
  ObjectId = Types.ObjectId;
module.exports = function (options = {}) {
  return async context => {
    let total, data;
    let request = context.params.query.logs;
    if (context.params.query.logs) {
      switch (request.service) {
        case 'users':
          if ((request.fromDate === '' || request.toDate === '')) {
            total = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'service': {
                    $eq: 'users'
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {username: '$username'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        patient: '$patient',
                        prescriber: '$prescriber',
                        drug: '$drug',
                        dea: '$dea',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        previousValues: '$previousValues',
                        currentValues: '$currentValues',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
                      }
                    }
                  }
              },
              {
                $count: 'total_count'
              }
            ]);
            data = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'service': {
                    $eq: 'users'
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {username: '$username'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        patient: '$patient',
                        prescriber: '$prescriber',
                        drug: '$drug',
                        dea: '$dea',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        previousValues: '$previousValues',
                        currentValues: '$currentValues',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
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
              {$limit: 25}

            ]);
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
          } else {
            total = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'createdAt': {
                    $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),

                    $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
                  },
                  'service': {
                    $eq: 'users'
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {username: '$username'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        patient: '$patient',
                        prescriber: '$prescriber',
                        drug: '$drug',
                        dea: '$dea',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        previousValues: '$previousValues',
                        currentValues: '$currentValues',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
                      }
                    }
                  }
              },
              {
                $count: 'total_count'
              }
            ]);
            data = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'createdAt': {
                    $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),

                    $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
                  },
                  'service': {
                    $eq: 'users'
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {username: '$username'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        patient: '$patient',
                        prescriber: '$prescriber',
                        drug: '$drug',
                        dea: '$dea',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        previousValues: '$previousValues',
                        currentValues: '$currentValues',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
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
              {$limit: 25},

            ]);
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
          }
          break;
        case 'rx':
          if ((request.fromDate === '' || request.toDate === '')) {
            total = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'service': {
                    $eq: 'rx'
                  },
                  'rxId': {
                    $ne: ''
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {rxId: '$rxId'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        patient: '$patient',
                        prescriber: '$prescriber',
                        drug: '$drug',
                        dea: '$dea',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        previousValues: '$previousValues',
                        currentValues: '$currentValues',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
                      }
                    }
                  }
              },
              {
                $count: 'total_count'
              }
            ]);
            data = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'service': {
                    $eq: 'rx'
                  },
                  'rxId': {
                    $ne: ''
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {rxId: '$rxId'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        patient: '$patient',
                        prescriber: '$prescriber',
                        drug: '$drug',
                        dea: '$dea',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        previousValues: '$previousValues',
                        currentValues: '$currentValues',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
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
              {$limit: 25}

            ]);
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
          } else {
            total = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'createdAt': {
                    $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),

                    $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
                  },
                  'service': {
                    $eq: 'rx'
                  },
                  'rxId': {
                    $ne: ''
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {rxId: '$rxId'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        patient: '$patient',
                        prescriber: '$prescriber',
                        drug: '$drug',
                        dea: '$dea',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        previousValues: '$previousValues',
                        currentValues: '$currentValues',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
                      }
                    }
                  }
              },
              {
                $count: 'total_count'
              }
            ]);
            data = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'createdAt': {
                    $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),

                    $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
                  },
                  'service': {
                    $eq: 'rx'
                  },
                  'rxId': {
                    $ne: ''
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {rxId: '$rxId'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        patient: '$patient',
                        prescriber: '$prescriber',
                        drug: '$drug',
                        dea: '$dea',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        previousValues: '$previousValues',
                        currentValues: '$currentValues',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
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
              {$limit: 25},

            ]);
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
          }
          break;
        case 'patient':
          if ((request.fromDate === '' || request.toDate === '')) {
            total = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'service': {
                    $eq: 'patient'
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {patient: '$patient'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        patient: '$patient',
                        prescriber: '$prescriber',
                        drug: '$drug',
                        dea: '$dea',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        previousValues: '$previousValues',
                        currentValues: '$currentValues',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
                      }
                    }
                  }
              },
              {
                $count: 'total_count'
              }
            ]);
            data = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'service': {
                    $eq: 'patient'
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {patient: '$patient'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        patient: '$patient',
                        prescriber: '$prescriber',
                        drug: '$drug',
                        dea: '$dea',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        previousValues: '$previousValues',
                        currentValues: '$currentValues',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
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
              {$limit: 25}

            ]);
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
          } else {
            total = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'createdAt': {
                    $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),

                    $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
                  },
                  'service': {
                    $eq: 'patient'
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {patient: '$patient'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        patient: '$patient',
                        prescriber: '$prescriber',
                        drug: '$drug',
                        dea: '$dea',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        previousValues: '$previousValues',
                        currentValues: '$currentValues',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
                      }
                    }
                  }
              },
              {
                $count: 'total_count'
              }
            ]);
            data = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'createdAt': {
                    $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),

                    $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
                  },
                  'service': {
                    $eq: 'patient'
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {patient: '$patient'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        patient: '$patient',
                        prescriber: '$prescriber',
                        drug: '$drug',
                        dea: '$dea',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        previousValues: '$previousValues',
                        currentValues: '$currentValues',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
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
              {$limit: 25},

            ]);
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
          }
          break;
        case 'prescriber':
          if ((request.fromDate === '' || request.toDate === '')) {
            total = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'service': {
                    $eq: 'prescriber'
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {prescriber: '$prescriber'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        patient: '$patient',
                        prescriber: '$prescriber',
                        drug: '$drug',
                        dea: '$dea',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        previousValues: '$previousValues',
                        currentValues: '$currentValues',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
                      }
                    }
                  }
              },
              {
                $count: 'total_count'
              }
            ]);
            data = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'service': {
                    $eq: 'prescriber'
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {prescriber: '$prescriber'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        patient: '$patient',
                        prescriber: '$prescriber',
                        drug: '$drug',
                        dea: '$dea',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        previousValues: '$previousValues',
                        currentValues: '$currentValues',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
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
              {$limit: 25}

            ]);
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
          } else {
            total = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'createdAt': {
                    $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),

                    $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
                  },
                  'service': {
                    $eq: 'prescriber'
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {prescriber: '$prescriber'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        patient: '$patient',
                        prescriber: '$prescriber',
                        drug: '$drug',
                        dea: '$dea',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        previousValues: '$previousValues',
                        currentValues: '$currentValues',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
                      }
                    }
                  }
              },
              {
                $count: 'total_count'
              }
            ]);
            data = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'createdAt': {
                    $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),

                    $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
                  },
                  'service': {
                    $eq: 'prescriber'
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {prescriber: '$prescriber'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        patient: '$patient',
                        prescriber: '$prescriber',
                        drug: '$drug',
                        dea: '$dea',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        previousValues: '$previousValues',
                        currentValues: '$currentValues',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
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
              {$limit: 25},

            ]);
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
          }
          break;
        case 'authentication':
          if ((request.fromDate === '' || request.toDate === '')) {
            total = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'service': {
                    $eq: 'authentication'
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {username: '$username'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
                      }
                    }
                  }
              },
              {
                $count: 'total_count'
              }
            ]);
            data = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'service': {
                    $eq: 'authentication'
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {username: '$username'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
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
              {$limit: 25}

            ]);
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
          } else {
            total = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'createdAt': {
                    $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),

                    $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
                  },
                  'description': {
                    $ne: 'Updated undefined'
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {username: '$username'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
                      }
                    }
                  }
              },
              {
                $count: 'total_count'
              }
            ]);
            data = await context.app.service('audit-logs').Model.aggregate([
              {
                $match: {
                  'createdAt': {
                    $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),

                    $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()),
                  },
                  'description': {
                    $ne: 'Updated undefined'
                  }
                }
              },
              {
                $group:
                  {
                    _id: {userName: {username: '$username'}},
                    itemsArray: {
                      $push: {
                        userId: '$userId',
                        pharmacyId: '$pharmacyId',
                        username: '$username',
                        rxId: '$rxId',
                        messageId: '$messageId',
                        data: '$data',
                        updateFields: '$updateFields',
                        service: '$service',
                        method: '$method',
                        description: '$description',
                        outcome: '$outcome',
                        createdAt: '$createdAt',
                        updatedAt: '$updatedAt'
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
              {$limit: 25},

            ]);
            context.result = {
              total: total[0] === undefined ? 0 : total[0].total_count,
              data: data
            };
          }
          break;
      }
    }
    return context;
  };
}
