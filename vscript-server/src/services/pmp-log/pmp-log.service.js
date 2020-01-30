// Initializes the `pmpLog` service on path `/pmp-log`
const createService = require('feathers-mongoose');
const createModel = require('../../models/pmp-log.model');
const hooks = require('./pmp-log.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/pmp-log', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('pmp-log');

  service.hooks(hooks);
};
