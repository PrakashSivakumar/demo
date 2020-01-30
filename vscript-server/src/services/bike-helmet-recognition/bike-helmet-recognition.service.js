// Initializes the `bikeHelmetRecognition` service on path `/bike-helmet-recognition`
const createService = require('feathers-mongoose');
const createModel = require('../../models/bike-helmet-recognition.model');
const hooks = require('./bike-helmet-recognition.hooks');
const filters = require('./bike-helmet-recognition.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'bike-helmet-recognition',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/bike-helmet-recognition', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('bike-helmet-recognition');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
