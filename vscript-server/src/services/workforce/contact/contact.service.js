// Initializes the `workforce/contact` service on path `/workforce/contact`
const createService = require('feathers-mongoose');
const createModel = require('../../../models/workforce/contact.model');
const hooks = require('./contact.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/workforce-contact', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('workforce-contact');

  service.hooks(hooks);
};
