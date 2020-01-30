// Initializes the `gsdd5-Product_Adverse_Reaction` service on path `/gsdd5-product-adverse-reaction`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/gsdd5/gsdd-5-product-adverse-reaction.model');
const hooks = require('./gsdd-5-product-adverse-reaction.hooks');
const filters = require('./gsdd-5-product-adverse-reaction.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'gsdd-5-product-adverse-reaction',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gsdd5-product-adverse-reaction', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('gsdd5-product-adverse-reaction');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
