// Initializes the `ownerdrug-margin` service on path `/ownerdrug-margin`
const createService = require('./ownerdrug-margin.class.js');
const hooks = require('./ownerdrug-margin.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/ownerdrug-margin', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('ownerdrug-margin');

  service.hooks(hooks);
};
