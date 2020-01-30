const { authenticate } = require('@feathersjs/authentication').hooks;

const insertPmpLog = require('../../hooks/insert-pmp-log');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [insertPmpLog()],
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
