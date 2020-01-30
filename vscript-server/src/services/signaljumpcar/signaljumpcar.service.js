// Initializes the `signaljumpcar` service on path `/signaljumpcar`
const createService = require('feathers-mongoose');
const createModel = require('../../models/signaljumpcar.model');
const hooks = require('./signaljumpcar.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/signaljumpcar', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('signaljumpcar');

  service.hooks(hooks);
};
