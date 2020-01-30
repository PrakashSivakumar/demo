

const vectorsoftMail = require('../../hooks/vectorsoft-mail');

const vacationMail = require('../../hooks/vacation-mail');

module.exports = {
  before: {
    all: [],
    find: [vacationMail()],
    get: [],
    create: [vectorsoftMail()],
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
