// Initializes the `owner-transaction` service on path `/owner-transaction`
const createService = require('./owner-transaction.class.js');
const hooks = require('./owner-transaction.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/owner-transaction', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('owner-transaction');

  service.hooks(hooks);
};
