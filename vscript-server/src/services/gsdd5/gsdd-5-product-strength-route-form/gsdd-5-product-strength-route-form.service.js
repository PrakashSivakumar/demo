// Initializes the `gsdd5-Product_Strength_Route_Form` service on path `/gsdd5-product-strength-route-form`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/gsdd5/gsdd-5-product-strength-route-form.model');
const hooks = require('./gsdd-5-product-strength-route-form.hooks');
const filters = require('./gsdd-5-product-strength-route-form.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'gsdd-5-product-strength-route-form',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gsdd5-product-strength-route-form', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('gsdd5-product-strength-route-form');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
