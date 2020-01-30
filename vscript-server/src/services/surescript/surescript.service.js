// Initializes the `surescript` service on path `/surescript`
const createService = require('feathers-mongoose');
const createModel = require('../../models/surescript.model');
const hooks = require('./surescript.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/surescript', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('surescript');

  service.hooks(hooks);
};
