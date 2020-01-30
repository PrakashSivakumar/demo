// Initializes the `addEmployee` service on path `/add-employee`
const createService = require('feathers-mongoose');
const createModel = require('../../models/workforce/add-employee.model');
const hooks = require('./add-employee.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/add-employee', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('add-employee');

  service.hooks(hooks);
};
