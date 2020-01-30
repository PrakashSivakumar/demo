const { authenticate } = require('@feathersjs/authentication').hooks;

const gsdd5Upload = require('../../hooks/gsdd-5-upload');

module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [gsdd5Upload()],
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
