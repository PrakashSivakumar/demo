const {authenticate} = require('@feathersjs/authentication').hooks;
const {populate} = require('feathers-hooks-common');
const notification = require('../../hooks/notification/notification-hook');
const createLogs = require('../../hooks/create-rx-log');
const rxControl = require('../../hooks/rx-access');

const postRxSchema = {
  include: [{
    service: 'patient',
    nameAs: 'patient',
    parentField: 'patient_id',
    childField: '_id'
  },
    {
      service: 'prescriber',
      nameAs: 'prescriber',
      parentField: 'prescriber_id',
      childField: '_id'
    },
    {
      service: 'gsdd5-product',
      nameAs: 'product',
      parentField: 'productDetails.productName',
      childField: '_id'
    },
    {
      service: 'users',
      nameAs: 'user',
      parentField: 'isActive',
      childField: '_id'
    },
    {
      service: 'pharmacy',
      nameAs: 'pharmacy',
      parentField: 'pharmacy_id',
      childField: '_id'
    },
  ]
};


const saveRxImage = require('../../hooks/save-rx-image');

const dashboard = require('../../hooks/dashboard');

const digitalSign = require('../../hooks/digital-sign');

const rxUpdate = require('../../hooks/rx-update');

const rxUpdateElastic = require('../../hooks/elastic-update');


module.exports = {
  before: {
    all: [authenticate('jwt'),
      // rxControl()
    ],
    find: [
      dashboard()
    ],
    get: [],
    create: [
      digitalSign()
      , saveRxImage()
    ],
    update: [],
    patch: [
      saveRxImage(),
      rxUpdate()
      // ,rxUpdateElastic()
    ],
    remove: []
  },
  after: {
    all: [
      populate({schema: postRxSchema})
    ],
    find: [],
    get: [],
    create: [
      notification()
      , createLogs()
    ],
    update: [createLogs()],
    patch: [
      notification(),
    ],
    remove: [
      createLogs()
    ]
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [
      createLogs()
    ],
    update: [
      createLogs()
    ],
    patch: [
      /*createLogs()*/
    ],
    remove: [
      createLogs()
    ]
  }
};
