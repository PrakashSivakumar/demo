// Initializes the `gssd5-Federal` service on path `/gsdd5-federal`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/gsdd5/gssd-5-federal.model');
const hooks = require('./gssd-5-federal.hooks');
const filters = require('./gssd-5-federal.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'gssd-5-federal',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gsdd5-federal', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('gsdd5-federal');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
