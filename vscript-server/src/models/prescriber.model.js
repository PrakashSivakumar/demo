// prescriber-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const prescriber = new Schema({
    npi: {
      type: Number
    },
    name: {
      firstName: {
        type:String,
        lowercase: true,
        // required: true
      },
      lastName: {
        type:String,
        lowercase: true,
        required:true
      }
    },
    address: {
      line1: String,
      line2: String,
      zipcode: String,
      city: String,
      state: String,
    },
    contact: {
      phone: String,
      faxNumber: String,
      email: String,
    },
    license: {
      licenseType: String,
      licensenumber: Number,
    },
    deaNumber: {
      type: String,
      // unique: true,
      // required:true
    },
    practiceLocations: [{
      name: String,
      addressLine1: String,
      addressLine2: String,
      state: String,
      city: String,
      zipCode: String,
      phone: String,
      fax: String,
      officePhone: String,
      email: String,
    }],
    facility: String,
    upinNumber: Number,
    spi: String,
    insuranceRestriction: String,
    medicalIdProviderNumber: Number,
    primaryCareProviderId: String,
  }, {
    timestamp: true,
  });
  prescriber.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('prescriber', prescriber);
};
