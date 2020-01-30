// Initializes the `gsdd5-Marketed_Product_RxNorm_Prescribable_Name` service on path `/gsdd5-marketed-product-rx-norm-prescribable-name`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/gsdd5/gsdd-5-marketed-product-rx-norm-prescribable-name.model');
const hooks = require('./gsdd-5-marketed-product-rx-norm-prescribable-name.hooks');
const filters = require('./gsdd-5-marketed-product-rx-norm-prescribable-name.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'gsdd-5-marketed-product-rx-norm-prescribable-name',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gsdd5-marketed-product-rx-norm-prescribable-name', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('gsdd5-marketed-product-rx-norm-prescribable-name');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
