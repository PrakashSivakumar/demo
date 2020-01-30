// Initializes the `workforce/employee` service on path `/workforce/employee`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/workforce/employee.model');
const hooks = require('./employee.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/workforce-employee', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('workforce-employee');

  service.hooks(hooks);
};
