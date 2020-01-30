const { authenticate } = require('@feathersjs/authentication').hooks;

const ownerTransactionreport = require('../../../hooks/reports/owner-transactionreport');

module.exports = {
  before: {
    all: [
      //authenticate('jwt')
    ],
    find: [],
    get: [],
    create: [ownerTransactionreport()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
