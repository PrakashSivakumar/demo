// patient-flutter-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const patientFlutter = new Schema({
    rxnumber: { type: String },
    scannedImage: String,
    patientName: String,
    read: String,
    deleted: String,
  }, {
    timestamps: true
  });

  return mongooseClient.model('patientFlutter', patientFlutter);
};
