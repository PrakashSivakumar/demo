const {authenticate} = require('@feathersjs/authentication').hooks;
const {populate} = require('feathers-hooks-common');
const dashboard = require('../../hooks/dashboard');
const elasticUpdate = require('../../hooks/elastic-update');

const {
  hashPassword, protect,
} = require('@feathersjs/authentication-local').hooks;

const searchRegex = require('../../hooks/search-regex');


const postUsersSchema = {
  include: [{
    service: 'pharmacy',
    nameAs: 'details.pharmacy',
    parentField: 'details.pharmacy_id',
    childField: '_id'
  }]
};

const elasticSearch = require('../../hooks/elastic-search');
const globalSearch = require('../../hooks/global-search');

// const checkUserActive = require('../../hooks/check-user-active');

module.exports = {
  before: {
    all: [],
    find: [authenticate('jwt'),
      elasticSearch(),
    ],
    get: [
      // checkUserActive(),
      authenticate('jwt')
    ],
    create: [hashPassword()],
    update: [hashPassword(), authenticate('jwt')],
    patch: [hashPassword(), authenticate('jwt'),
      elasticUpdate()
    ],
    remove: [ elasticUpdate(), authenticate('jwt')],
  },

  after: {
    all: [
      populate({schema: postUsersSchema}),
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      // protect('password'),
    ],
    find: [
      // dashboard()
    ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};

