// Initializes the `druglistEDI` service on path `/druglist-edi`
const createService = require('feathers-mongoose');
const createModel = require('../../models/druglist-edi.model');
const hooks = require('./druglist-edi.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/druglist-edi', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('druglist-edi');

  service.hooks(hooks);
};
