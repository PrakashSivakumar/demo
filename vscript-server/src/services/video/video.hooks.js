const { authenticate } = require('@feathersjs/authentication').hooks;
const twilio = require('twilio');
const feathers = require('@feathersjs/feathers');

const configuration = require('@feathersjs/configuration');

let conf = configuration();

let app = feathers()
  .configure(conf);



let twilioConfig = () =>{
  console.log(app.get('twilio'));
  console.log();
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [twilioConfig()],
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
