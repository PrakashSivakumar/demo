// Initializes the `prescriber` service on path `/prescriber`
const createService = require('feathers-mongoose');
const createModel = require('../../models/prescriber.model');
const hooks = require('./prescriber.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate,
  };

  // Initialize our service with any options it requires
  app.use('/prescriber', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('prescriber');

  service.hooks(hooks);
};
