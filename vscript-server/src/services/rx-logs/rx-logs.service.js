// Initializes the `rxLogs` service on path `/rx-logs`
const createService = require('feathers-mongoose');
const createModel = require('../../models/rx-logs.model');
const hooks = require('./rx-logs.hooks');
const filters = require('./rx-logs.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'rx-logs',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/rx-logs', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('rx-logs');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
