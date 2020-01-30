
const {populate} = require('feathers-hooks-common');

const postEmployeeSchema = {
  include: [{
    service: 'workforce-contact',
    nameAs: 'contact',
    parentField: 'contact_id',
    childField: '_id'
  },
    {
      service: 'workforce-dependents',
      nameAs: 'dependents',
      parentField: 'dependents_id',
      childField: '_id'
    },
    {
      service: 'workforce-education',
      nameAs: 'education',
      parentField: 'education_id',
      childField: '_id'
    },
    {
      service: 'workforce-placements',
      nameAs: 'placements',
      parentField: 'placements_id',
      childField: '_id'
    },
    {
      service: 'workforce-skills',
      nameAs: 'skills',
      parentField: 'skills_id',
      childField: '_id'
    },
    {
      service: 'workforce-workauthorization',
      nameAs: 'workAuthorizationCollection',
      parentField: 'workAuthorization_id',
      childField: '_id'
    }
  ]
};

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [
      populate({schema: postEmployeeSchema})
    ],
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
