// Initializes the `loginlogs` service on path `/loginlogs`
const createService = require('feathers-mongoose');
const createModel = require('../../models/loginlogs.model');
const hooks = require('./loginlogs.hooks');
const filters = require('./loginlogs.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'loginlogs',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/loginlogs', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('loginlogs');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
