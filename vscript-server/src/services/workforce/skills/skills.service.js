// Initializes the `workforce/skills` service on path `/workforce/skills`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/workforce/skills.model');
const hooks = require('./skills.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/workforce-skills', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('workforce-skills');

  service.hooks(hooks);
};
