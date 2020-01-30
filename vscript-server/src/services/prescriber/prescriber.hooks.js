const {authenticate} = require('@feathersjs/authentication').hooks;
const searchRegex = require('../../hooks/search-regex');
const notification = require('../../hooks/notification/notification-hook');
const elasticSearch = require('../../hooks/elastic-search');
const prescriberUpdate = require('../../hooks/elastic-update');
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [elasticSearch()],
    get: [],
    create: [],
    update: [],
    patch: [
      prescriberUpdate()
    ],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [notification()],
    update: [],
    patch: [notification()],
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
