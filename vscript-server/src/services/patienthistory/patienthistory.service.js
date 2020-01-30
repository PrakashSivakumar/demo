// Initializes the `patienthistory` service on path `/patienthistory`
const createService = require('./patienthistory.class.js');
const hooks = require('./patienthistory.hooks');
const filters = require('./patienthistory.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'patienthistory',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/patienthistory', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('patienthistory');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
