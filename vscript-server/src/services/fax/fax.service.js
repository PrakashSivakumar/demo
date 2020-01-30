// Initializes the `fax` service on path `/fax`
const createService = require('feathers-mongoose');
const createModel = require('../../models/fax.model');
const hooks = require('./fax.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/fax', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('fax');

  service.hooks(hooks);
};
