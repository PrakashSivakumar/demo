// Initializes the `gsdd5-GSTerm_ICD10` service on path `/gsdd5-gs-term-icd10`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/gsdd5/gsdd-5-gs-term-icd-10.model');
const hooks = require('./gsdd-5-gs-term-icd-10.hooks');
const filters = require('./gsdd-5-gs-term-icd-10.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'gsdd-5-gs-term-icd-10',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gsdd5-gs-term-icd10', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('gsdd5-gs-term-icd10');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
