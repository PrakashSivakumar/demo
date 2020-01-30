// Initializes the `callEnd` service on path `/call-end`
const createService = require('feathers-mongoose');
const createModel = require('../../models/call-end.model');
const hooks = require('./call-end.hooks');
const filters = require('./call-end.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'call-end',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/call-end', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('call-end');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
