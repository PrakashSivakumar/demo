// Initializes the `ownerReport` service on path `/owner-report`
const createService = require('./owner-report.class.js');
const hooks = require('./owner-report.hooks');
const filters = require('./owner-report.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'owner-report',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/owner-report', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('owner-report');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
