// Initializes the `gsdd5-Warning_Label_Group` service on path `/gsdd5-warning-label-group`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/gsdd5/gsdd-5-warning-label-group.model');
const hooks = require('./gsdd-5-warning-label-group.hooks');
const filters = require('./gsdd-5-warning-label-group.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'gsdd-5-warning-label-group',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gsdd5-warning-label-group', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('gsdd5-warning-label-group');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
