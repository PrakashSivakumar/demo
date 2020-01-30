// Initializes the `productOrder` service on path `/product-order`
const createService = require('feathers-mongoose');
const createModel = require('../../models/product-order.model');
const hooks = require('./product-order.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/product-order', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('product-order');

  service.hooks(hooks);
};
