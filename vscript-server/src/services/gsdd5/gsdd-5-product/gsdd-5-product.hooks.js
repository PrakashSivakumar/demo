const { authenticate } = require('@feathersjs/authentication').hooks;
const {populate} = require('feathers-hooks-common');
const elasticSearch = require('../../../hooks/elastic-search');

const postPackageSchema = {
  include: [{
    service: 'gsdd5-package',
    nameAs: 'package',
    parentField: 'ProductID',
    childField: 'ProductID'
  }]
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [elasticSearch()],
    get: [populate({schema: postPackageSchema})],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [populate({schema: postPackageSchema})],
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
