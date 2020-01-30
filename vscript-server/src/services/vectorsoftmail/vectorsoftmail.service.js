// Initializes the `vectorsoftmail` service on path `/vectorsoftmail`
const createService = require('./vectorsoftmail.class.js');
const hooks = require('./vectorsoftmail.hooks');
const filters = require('./vectorsoftmail.filters');
const multer = require('multer');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');
  let filename;

  const options = {
    name: 'vectorsoftmail',
    paginate
  };

  const Storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, 'public');
    },
    filename: function (req, file, callback) {
      console.log(file)
      callback(null, file.originalname);
      options.filename = file.originalname;
    }
  });
  const upload = multer({storage: Storage});


  // Initialize our service with any options it requires
  app.use('/vectorsoftmail', upload.single('file'), createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('vectorsoftmail');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
