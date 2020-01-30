// Initializes the `inventory` service on path `/inventory`
const createService = require('./inventory.class.js');
const hooks = require('./inventory.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/inventory', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('inventory');

  service.hooks(hooks);
};
