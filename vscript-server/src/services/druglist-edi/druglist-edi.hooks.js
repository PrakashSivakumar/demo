const {authenticate} = require('@feathersjs/authentication').hooks;
const ediUpload = require('../../hooks/edi-upload');
const searchRegex = require('../../hooks/search-regex');
const elasticSearch = require('../../hooks/elastic-search');


const inventoryManage = require('../../hooks/inventory-manage');


module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [
      elasticSearch(),
      inventoryManage()
    ],
    get: [],
    create: [ediUpload()],
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
