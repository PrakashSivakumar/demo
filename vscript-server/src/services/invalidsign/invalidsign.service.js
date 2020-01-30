// Initializes the `invalidsign` service on path `/invalidsign`
const createService = require('feathers-mongoose');
const createModel = require('../../models/invalidsign.model');
const hooks = require('./invalidsign.hooks');
const filters = require('./invalidsign.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'invalidsign',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/invalidsign', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('invalidsign');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
