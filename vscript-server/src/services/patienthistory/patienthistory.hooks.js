const {authenticate} = require('@feathersjs/authentication').hooks;
const {populate} = require('feathers-hooks-common');
const patientHistory = require('../../hooks/patienthistory');
const postRxSchema = {
  include: [
    {
      service: 'prescriber',
      nameAs: 'prescriber',
      parentField: 'prescriber_id',
      childField: '_id'
    }
  ]
};
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [patientHistory()],
    get: [],
    create: [],
    update: [],
    patch: [],
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
