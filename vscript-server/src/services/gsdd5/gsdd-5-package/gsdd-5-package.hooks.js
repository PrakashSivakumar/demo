const {authenticate} = require('@feathersjs/authentication').hooks;
const {populate} = require('feathers-hooks-common');
const elasticSearch = require('../../../hooks/elastic-search');
const getWarnings = require('../../../hooks/get-warnings');



const postPackageSchema = {
  include: [{
    service: 'gsdd5-price',
    nameAs: 'price',
    parentField: 'PackageID',
    childField: 'PackageID'
  }, {
    service: 'gsdd5-product',
    nameAs: 'product',
    parentField: 'ProductID',
    childField: 'ProductID'
  }]
};
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [
      elasticSearch(), getWarnings(),

    ],
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
