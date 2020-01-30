// Initializes the `timeSheets` service on path `/time-sheets`
const createService = require('feathers-mongoose');
const createModel = require('../../models/time-sheets.model');
const hooks = require('./time-sheets.hooks');
const filters = require('./time-sheets.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'time-sheets',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/time-sheets', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('time-sheets');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
