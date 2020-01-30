// Initializes the `twilio` service on path `/twilio`
const createService = require('./twilio.class.js');
const hooks = require('./twilio.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/twilio', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('twilio');

  service.hooks(hooks);
};
