// Initializes the `dicejobs` service on path `/dicejobs`
const createService = require('feathers-mongoose');
const createModel = require('../../models/dicejobs.model');
const hooks = require('./dicejobs.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/dicejobs', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('dicejobs');

  service.hooks(hooks);
};
