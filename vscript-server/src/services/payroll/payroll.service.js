// Initializes the `payroll` service on path `/payroll`
const createService = require('feathers-mongoose');
const createModel = require('../../models/payroll.model');
const hooks = require('./payroll.hooks');
const filters = require('./payroll.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'payroll',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/payroll', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('payroll');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
