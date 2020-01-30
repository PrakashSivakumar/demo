// Initializes the `videolastweek` service on path `/videolastweek`
const createService = require('feathers-mongoose');
const createModel = require('../../models/videolastweek.model');
const hooks = require('./videolastweek.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/videolastweek', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('videolastweek');

  service.hooks(hooks);
};
