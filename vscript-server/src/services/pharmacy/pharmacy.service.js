// Initializes the `pharmacy` service on path `/pharmacy`
const createService = require('feathers-mongoose');
const createModel = require('../../models/pharmacy.model');
const hooks = require('./pharmacy.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/pharmacy', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('pharmacy');

  service.hooks(hooks);
};
