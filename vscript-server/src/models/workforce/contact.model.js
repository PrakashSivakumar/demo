// workforce/contact-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongodbWorkForce');
  const { Schema } = mongooseClient;
  const contact = new Schema({
    presentAddress: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      country: String,
      state: String,
      zipcode: String,
      livedFrom: String,
      livedUntil: String,
      homePhone: Number,
      officePhone: Number,
    },
    permanentAddress: {
      contactName: String,
      addressLine1: String,
      addressLine2: String,
      city: String,
      country: String,
      state: String,
      zipcode: String,
      homePhone: Number,
      mobileNumber: Number
    },
    emergencyContact: {
      contactInfo: {
        contactName: String,
        relationship: String,
        contactNumber: Number,
        contactemailId: String,
        homePhone: Number,
        officePhone: Number
      },
      address: {
        addressLine1: String,
        addressLine2: String,
        city: String,
        country: String,
        state: String,
        zipcode: String
      }
    }
  }, {
    timestamps: true
  });

  return mongooseClient.model('contact', contact);
};
