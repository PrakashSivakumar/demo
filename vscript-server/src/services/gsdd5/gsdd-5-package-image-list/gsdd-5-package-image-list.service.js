// Initializes the `gsdd5-package-image-list` service on path `/gsdd5-package-image-list`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/gsdd5/gsdd-5-package-image-list.model');
const hooks = require('./gsdd-5-package-image-list.hooks');
const filters = require('./gsdd-5-package-image-list.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'gsdd-5-package-image-list',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gsdd5-package-image-list', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('gsdd5-package-image-list');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
