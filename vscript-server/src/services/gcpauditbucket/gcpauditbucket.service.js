// Initializes the `gcpauditbucket` service on path `/gcpauditbucket`
const createService = require('./gcpauditbucket.class.js');
const hooks = require('./gcpauditbucket.hooks');
const filters = require('./gcpauditbucket.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'gcpauditbucket',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gcpauditbucket', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('gcpauditbucket');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
