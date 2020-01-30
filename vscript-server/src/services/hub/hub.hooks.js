const { authenticate } = require('@feathersjs/authentication').hooks;
const {populate} = require('feathers-hooks-common');
/*const postSchema = {
  include: [{
    service: 'pharmacy',
    nameAs: 'pharmacys',
    parentField: 'pharmacy.pharmacies.id',
    childField: '_id'
    },
    {
      service: 'users',
      nameAs: 'pharmacists',
      parentField: 'pharmacists',
      childField: '_id'
    },
    {
      service: 'users',
      nameAs: 'technicians',
      parentField: 'technicians',
      childField: '_id'
    },
  ]
}*/

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
