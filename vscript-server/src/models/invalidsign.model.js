// invalidsign-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const invalidsign = new Schema({
    patientFName: String,
    patientLName: String,
    prescriberFName: String,
    prescriberLName: String,
    drugName: String,
    signatureVerified: String,
    signature: String
  }, {
    timestamps: true
  });

  return mongooseClient.model('invalidsign', invalidsign);
};
