// Initializes the `gsdd5-GSTerms` service on path `/gsdd5-gs-terms`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/gsdd5/gsdd-5-gs-terms.model');
const hooks = require('./gsdd-5-gs-terms.hooks');
const filters = require('./gsdd-5-gs-terms.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'gsdd-5-gs-terms',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gsdd5-gs-terms', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('gsdd5-gs-terms');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
