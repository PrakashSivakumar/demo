// Initializes the `migration` service on path `/migration`
const createService = require('./migration.class.js');
const hooks = require('./migration.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/migration', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('migration');

  service.hooks(hooks);
};
