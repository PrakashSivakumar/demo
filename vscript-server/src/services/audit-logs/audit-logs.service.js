// Initializes the `audit-logs` service on path `/audit-logs`
const createService = require('feathers-mongoose');
const createModel = require('../../models/audit-logs.model');
const hooks = require('./audit-logs.hooks');
const filters = require('./audit-logs.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'audit-logs',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/audit-logs', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('audit-logs');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
