const {authenticate} = require('@feathersjs/authentication').hooks;


const processPatient = require('../../hooks/process-patient');
const notification = require('../../hooks/notification/notification-hook');
const searchRegex = require('../../hooks/search-regex');

const elasticSearch = require('../../hooks/elastic-search');


const patientUpdate = require('../../hooks/elastic-update');

const user = require('../../hooks/patient-user');


module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [
      elasticSearch()
    ],
    get: [],
    create: [],
    update: [],
    patch: [
       patientUpdate()
    ],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [
      user(),
      notification()],
    update: [],
    patch: [
      // user(),
      notification()],
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
