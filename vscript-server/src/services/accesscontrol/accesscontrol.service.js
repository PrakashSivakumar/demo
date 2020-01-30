// Initializes the `accesscontrol` service on path `/accesscontrol`
const createService = require('feathers-mongoose');
const createModel = require('../../models/accesscontrol.model');
const hooks = require('./accesscontrol.hooks');
const filters = require('./accesscontrol.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'accesscontrol',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/accesscontrol', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('accesscontrol');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
