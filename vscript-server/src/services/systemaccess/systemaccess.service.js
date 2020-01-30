// Initializes the `systemaccess` service on path `/systemaccess`
const createService = require('feathers-mongoose');
const createModel = require('../../models/systemaccess.model');
const hooks = require('./systemaccess.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/systemaccess', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('systemaccess');

  service.hooks(hooks);
};
