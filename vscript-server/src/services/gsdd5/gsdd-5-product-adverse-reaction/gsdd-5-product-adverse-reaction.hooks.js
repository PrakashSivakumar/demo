const {authenticate} = require('@feathersjs/authentication').hooks;
const adverseReaction = require('../../../hooks/adverse-reaction');
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [adverseReaction()],
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
