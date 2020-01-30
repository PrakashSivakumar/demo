// Initializes the `workforce/dependents` service on path `/workforce/dependents`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/workforce/dependents.model');
const hooks = require('./dependents.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/workforce-dependents', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('workforce-dependents');

  service.hooks(hooks);
};
