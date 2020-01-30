// vehicleDetails-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClientOCR = app.get('mongooseClientOCR');
  const mongoosastic = app.get('mongoosastic');
  const { Schema } = mongooseClientOCR;
  const vehicleDetails = new Schema({
    registrationNo: String,
    fuelType: String,
    ownerName: String,
    mfgYear: String,
    engineNo: String,
    chassisNo: String,
    RLW: String,
    taxAmount: String,
    taxPaidDate: String,
    nocTo: String,
    status: String,
    vehicleClass: String,
    vehicleColour: String,
    markersClass: String,
    dateOfRegistration: String,
    financier: String,
    registrationAuthority: String,
    bodyType: String,
    taxValidUpto: String
  }, {
    timestamps: true
  });

  vehicleDetails.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClientOCR.model('vehicleDetails', vehicleDetails);
};
