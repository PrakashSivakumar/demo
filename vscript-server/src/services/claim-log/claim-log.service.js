// Initializes the `claimLog` service on path `/claim-log`
const createService = require('feathers-mongoose');
const createModel = require('../../models/claim-log.model');
const hooks = require('./claim-log.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/claim-log', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('claim-log');

  service.hooks(hooks);
};
