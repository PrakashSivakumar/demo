// Initializes the `app-update` service on path `/app-update`
const createService = require('./app-update.class.js');
const hooks = require('./app-update.hooks');
const feathers = require('@feathersjs/feathers');
const authentication = require('@feathersjs/authentication');
const local = require('@feathersjs/authentication-local');
const app = feathers();
module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/app-update', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('app-update');

  service.hooks(hooks);
};
