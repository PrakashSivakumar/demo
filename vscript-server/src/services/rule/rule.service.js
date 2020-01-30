// Initializes the `rule` service on path `/rule`
const createService = require('feathers-mongoose');
const createModel = require('../../models/rule.model');
const hooks = require('./rule.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/rule', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('rule');

  service.hooks(hooks);
};
