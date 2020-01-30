// Initializes the `workforce/education` service on path `/workforce/education`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/workforce/education.model');
const hooks = require('./education.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/workforce-education', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('workforce-education');

  service.hooks(hooks);
};
