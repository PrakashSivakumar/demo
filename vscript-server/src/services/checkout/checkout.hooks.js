const { authenticate } = require('@feathersjs/authentication').hooks;
const { populate } = require('feathers-hooks-common') ;

const postRxSchema = {
  include: [{
    service: 'patient',
    nameAs: 'patient',
    parentField: 'pseudophedrinFlag.patientId',
    childField: '_id'
  }]
};

const report = require('../../hooks/reports/report');



const elasticSearch = require('../../hooks/elastic-search');
const checkoutupdate= require('../../hooks/checkoutupdate');

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [
      elasticSearch(),
 ],
    get: [],
    create: [],
    update: [],
    patch: [checkoutupdate()],
    remove: []
  },

  after: {
    all: [],
    find: [populate({ schema: postRxSchema })],
    get: [populate({ schema: postRxSchema })],
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
