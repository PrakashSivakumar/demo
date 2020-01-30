// Initializes the `workforce/placements` service on path `/workforce/placements`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/workforce/placements.model');
const hooks = require('./placements.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/workforce-placements', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('workforce-placements');

  service.hooks(hooks);
};
