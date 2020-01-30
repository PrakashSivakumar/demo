const { authenticate } = require('@feathersjs/authentication').hooks;
const elasticSearch = require('../../../hooks/elastic-search');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [elasticSearch()],
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
