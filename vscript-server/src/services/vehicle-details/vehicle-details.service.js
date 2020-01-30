// Initializes the `vehicleDetails` service on path `/vehicle-details`
const createService = require('feathers-mongoose');
const createModel = require('../../models/vehicle-details.model');
const hooks = require('./vehicle-details.hooks');
const filters = require('./vehicle-details.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'vehicle-details',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/vehicle-details', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('vehicle-details');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
