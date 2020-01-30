// Initializes the `hub\` service on path `/hub`
const createService = require('feathers-mongoose');
const createModel = require('../../models/hub.model');
const hooks = require('./hub.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/hub', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('hub');

  service.hooks(hooks);
};
