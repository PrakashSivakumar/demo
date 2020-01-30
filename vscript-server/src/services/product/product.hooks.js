const {authenticate} = require('@feathersjs/authentication').hooks;

const searchRegex = require('../../hooks/search-regex');
const elasticSearch = require('../../hooks/elastic-search');
const ediUpload = require('../../hooks/edi-upload');


module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [
      // searchRegex()
      elasticSearch()
    ],
    get: [],
    create: [
      ediUpload()
    ],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
