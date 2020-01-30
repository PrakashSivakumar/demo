const {authenticate} = require('@feathersjs/authentication').hooks;

const drugsearch = require('../../hooks/drugsearch');
const elasticSearch = require('../../hooks/elastic-search');
const ediUpload = require('../../hooks/edi-upload');

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [ediUpload()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [drugsearch()],
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
