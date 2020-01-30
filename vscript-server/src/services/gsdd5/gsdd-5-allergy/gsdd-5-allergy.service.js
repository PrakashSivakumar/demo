// Initializes the `gsdd5Allergy` service on path `/gsdd-5-allergy`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/gsdd5/gsdd-5-allergy.model');
const hooks = require('./gsdd-5-allergy.hooks');
const filters = require('./gsdd-5-allergy.filters');

module.exports = function () {

  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'gsdd-5-allergy',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gsdd-5-allergy', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('gsdd-5-allergy');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
