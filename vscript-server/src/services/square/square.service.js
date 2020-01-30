// Initializes the `square` service on path `/square`
const createService = require('feathers-mongoose');
const createModel = require('../../models/square.model');
const hooks = require('./square.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/square', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('square');

  service.hooks(hooks);
};
