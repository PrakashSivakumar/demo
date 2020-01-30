const {authenticate} = require('@feathersjs/authentication').hooks;

const hl7Parser = require('../../hooks/hl-7-parser');

const mssqlMigration = require('../../hooks/mssql-migration');

module.exports = {
  before: {
    all: [
      authenticate('jwt')
    ],
    find: [],
    get: [],
    create: [
      hl7Parser()
    ],
    update: [],
    patch: [
      mssqlMigration()
    ],
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
