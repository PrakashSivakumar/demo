// Initializes the `gsdd5-Warning_Label_Short` service on path `/gsdd-warning-label-short`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/gsdd5/gsdd-5-warning-label-short.model');
const hooks = require('./gsdd-5-warning-label-short.hooks');
const filters = require('./gsdd-5-warning-label-short.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'gsdd-5-warning-label-short',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gsdd-warning-label-short', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('gsdd-warning-label-short');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
