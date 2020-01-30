// Initializes the `refillresponse` service on path `/refillresponse`
const createService = require('./refillresponse.class.js');
const hooks = require('./refillresponse.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/refillresponse', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('refillresponse');

  service.hooks(hooks);
};
