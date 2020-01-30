const { authenticate } = require('@feathersjs/authentication').hooks;

const invalidsignreport = require('../../hooks/invalidsignreport');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [invalidsignreport()],
    get: [],
    create: [],
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
