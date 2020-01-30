// Initializes the `videothisweek` service on path `/videothisweek`
const createService = require('feathers-mongoose');
const createModel = require('../../models/videothisweek.model');
const hooks = require('./videothisweek.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/videothisweek', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('videothisweek');

  service.hooks(hooks);
};
