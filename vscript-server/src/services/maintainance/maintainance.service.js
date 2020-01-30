// Initializes the `maintainance` service on path `/maintainance`
const createService = require('feathers-mongoose');
const createModel = require('../../models/maintainance.model');
const hooks = require('./maintainance.hooks');
const filters = require('./maintainance.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'maintainance',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/maintainance', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('maintainance');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
