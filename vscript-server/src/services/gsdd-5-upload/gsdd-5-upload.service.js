// Initializes the `gsdd5Upload` service on path `/gsdd5-upload`
const createService = require('./gsdd-5-upload.class.js');
const hooks = require('./gsdd-5-upload.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gsdd5-upload', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('gsdd5-upload');

  service.hooks(hooks);
};
