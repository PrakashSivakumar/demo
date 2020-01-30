// Initializes the `countercollection` service on path `/countercollection`
const createService = require('feathers-mongoose');
const createModel = require('../../models/countercollection.model');
const hooks = require('./countercollection.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/countercollection', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('countercollection');

  service.hooks(hooks);
};
