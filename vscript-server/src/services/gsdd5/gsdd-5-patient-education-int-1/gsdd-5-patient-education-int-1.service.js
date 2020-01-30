// Initializes the `gsdd5-Patient_Education_Int1` service on path `/gsdd5-patient-education-int1`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/gsdd5/gsdd-5-patient-education-int-1.model');
const hooks = require('./gsdd-5-patient-education-int-1.hooks');
const filters = require('./gsdd-5-patient-education-int-1.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'gsdd-5-patient-education-int-1',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/gsdd5-patient-education-int1', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('gsdd5-patient-education-int1');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
