// Initializes the `videocollab` service on path `/videocollab`
const createService = require('feathers-mongoose');
const createModel = require('../../models/videocollab.model');
const hooks = require('./videocollab.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/videocollab', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('videocollab');

  service.hooks(hooks);
};
