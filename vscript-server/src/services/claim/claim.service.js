// Initializes the `claim` service on path `/claim`
const createService = require('./claim.class.js');
const hooks = require('./claim.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/claim', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('claim');

  service.hooks(hooks);
};
