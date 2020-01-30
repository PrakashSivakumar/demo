const { authenticate } = require('@feathersjs/authentication').hooks;

const xmlSurescripts = require('../../hooks/xml-surescripts');

const xmlpost = require('../../hooks/xmlpost');

const notification = require('../../hooks/notification/notification-hook');

const finddata = require('../../hooks/finddata');

const loginSure = require('../../hooks/login-sure');


module.exports = {
  before: {
    all: [
      // loginSure(),
      // authenticate('jwt')
    ],
    find: [],
    get: [finddata()],
    create: [xmlSurescripts()],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      notification()
      // xmlpost()
    ],
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
