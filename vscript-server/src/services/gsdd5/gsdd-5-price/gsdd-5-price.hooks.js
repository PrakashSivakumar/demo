const { authenticate } = require('@feathersjs/authentication').hooks;
const {populate} = require('feathers-hooks-common');

const postPriceSchema = {
  include: [{
    service: 'gsdd5-package',
    nameAs: 'package',
    parentField: 'PackageID',
    childField: 'PackageID'
  }]
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [populate({schema: postPriceSchema})],
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
