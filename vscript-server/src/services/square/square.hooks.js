const { authenticate } = require('@feathersjs/authentication').hooks;

const squaresdk = require('../../hooks/squaresdk');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [squaresdk()],
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
