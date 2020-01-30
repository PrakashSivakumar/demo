// Initializes the `rx` service on path `/rx`
const createService = require('feathers-mongoose');
const createModel = require('../../models/rx.model');
const hooks = require('./rx.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate

  };

  // Initialize our service with any options it requires
  app.use('/rx', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('rx');
  service.timeout = 10000;

  service.hooks(hooks);
};
