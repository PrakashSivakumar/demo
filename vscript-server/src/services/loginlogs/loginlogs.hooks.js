// const { authenticate } = require('@feathersjs/authentication').hooks;

const loginLogs = require('../../hooks/login-logs');

module.exports = {
  before: {
    all: [],
    find: [loginLogs()],
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
