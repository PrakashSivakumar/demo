// signaljumpcar-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientOCR');
  const { Schema } = mongooseClient;
  const signaljumpcar = new Schema({
    imagePath: String,
    vehicle: String,
    np_no: String,
    violation: String,
    time: String
  }, {
    timestamps: true
  });

  return mongooseClient.model('signaljumpcar', signaljumpcar);
};
