// Initializes the `xmlRefillRequest` service on path `/xml-refill-request`
const createService = require('./xml-refill-request.class.js');
const hooks = require('./xml-refill-request.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/xml-refill-request', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('xml-refill-request');

  service.hooks(hooks);
};
