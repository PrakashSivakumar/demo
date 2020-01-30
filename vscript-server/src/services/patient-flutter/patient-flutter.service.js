// Initializes the `patient-flutter` service on path `/patient-flutter`
const createService = require('feathers-mongoose');
const createModel = require('../../models/patient-flutter.model');
const hooks = require('./patient-flutter.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/patient-flutter', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('patient-flutter');

  service.hooks(hooks);
};
