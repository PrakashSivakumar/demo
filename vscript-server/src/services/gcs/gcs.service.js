// Initializes the `gcs` service on path `/gcs`
const createService = require('./gcs.class.js');
const hooks = require('./gcs.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gcs', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('gcs');

  service.hooks(hooks);
};
