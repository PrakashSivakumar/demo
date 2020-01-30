// Initializes the `video` service on path `/video`
const createService = require('feathers-mongoose');
const createModel = require('../../models/video.model');
const hooks = require('./video.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/video', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('video');

  service.hooks(hooks);
};
