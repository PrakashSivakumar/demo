// Initializes the `esearchsync` service on path `/esearchsync`
const createService = require('./esearchsync.class.js');
const hooks = require('./esearchsync.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/esearchsync', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('esearchsync');

  service.hooks(hooks);
};
