// Initializes the `receiveRx` service on path `/receive-rx`
const createService = require('./receive-rx.class.js');
const hooks = require('./receive-rx.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/receive-rx', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('receive-rx');

  service.hooks(hooks);
};
