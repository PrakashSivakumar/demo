// Initializes the `carSeatbeltRecognition` service on path `/car-seatbelt-recognition`
const createService = require('feathers-mongoose');
const createModel = require('../../models/car-seatbelt-recognition.model');
const hooks = require('./car-seatbelt-recognition.hooks');
const filters = require('./car-seatbelt-recognition.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'car-seatbelt-recognition',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/car-seatbelt-recognition', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('car-seatbelt-recognition');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
