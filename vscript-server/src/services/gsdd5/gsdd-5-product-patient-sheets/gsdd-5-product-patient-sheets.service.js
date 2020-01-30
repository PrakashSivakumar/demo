// Initializes the `gsdd5-Product_Patient_Sheets` service on path `/gsdd5-product-patient-sheets`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/gsdd5/gsdd-5-product-patient-sheets.model');
const hooks = require('./gsdd-5-product-patient-sheets.hooks');
const filters = require('./gsdd-5-product-patient-sheets.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'gsdd-5-product-patient-sheets',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gsdd5-product-patient-sheets', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('gsdd5-product-patient-sheets');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
