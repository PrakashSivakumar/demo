// Initializes the `tasklist` service on path `/tasklist`
const createService = require('feathers-mongoose');
const createModel = require('../../models/tasklist.model');
const hooks = require('./tasklist.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/tasklist', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('tasklist');

  service.hooks(hooks);
};
