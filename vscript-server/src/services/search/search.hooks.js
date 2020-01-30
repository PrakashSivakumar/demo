const { authenticate } = require('@feathersjs/authentication').hooks;

const globalSearch = require('../../hooks/global-search');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [globalSearch()],
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
