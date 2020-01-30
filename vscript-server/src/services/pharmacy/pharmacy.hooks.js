const { authenticate } = require('@feathersjs/authentication').hooks;
const elasticSearch = require('../../hooks/elastic-search');
const {populate} = require('feathers-hooks-common');
const saveRxImage = require('../../hooks/save-rx-image');
const postRxSchema = {
  include: [{
      service: 'users',
      nameAs: 'user',
      parentField: '_id',
      childField: 'details.pharmacy_id'
    },
  ]
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [elasticSearch()],
    get: [],
    create: [saveRxImage()],
    update: [],
    patch: [saveRxImage()],
    remove: []
  },

  after: {
    all: [populate({schema: postRxSchema})],
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
