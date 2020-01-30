// Initializes the `f5RejectCode` service on path `/f-5-reject-code`
const createService = require('feathers-mongoose');
const createModel = require('../../models/f-5-reject-code.model');
const hooks = require('./f-5-reject-code.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/f-5-reject-code', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('f-5-reject-code');

  service.hooks(hooks);
};
