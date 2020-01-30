const { authenticate } = require('@feathersjs/authentication').hooks;
const {populate} = require('feathers-hooks-common');
const rxlogs = require('../../hooks/rxlogs');

const postPatientSchema = {
  include: [{
    service: 'patient',
    nameAs: 'patient',
    parentField: 'patient_id',
    childField: '_id'
  },
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
    all: [ authenticate('jwt') ],
    find: [rxlogs()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [populate({schema: postPatientSchema})],
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
