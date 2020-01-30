const { authenticate } = require('@feathersjs/authentication').hooks;
const {populate} = require('feathers-hooks-common');
const getLogs = require('../../hooks/getlogs');

const postSchema = {
  include:[
    {
      service: 'users',
      nameAs: 'user',
      parentField: 'userId',
      childField: '_id'
    }
  ]
}

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [getLogs()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [populate({schema: postSchema})],
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
