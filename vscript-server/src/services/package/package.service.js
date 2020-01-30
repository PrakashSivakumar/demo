// Initializes the `package` service on path `/package`
const createService = require('feathers-mongoose');
const createModel = require('../../models/package.model');
const hooks = require('./package.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/package', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('package');

  service.hooks(hooks);
};
