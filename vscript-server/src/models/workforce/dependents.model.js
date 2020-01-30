// workforce/dependents-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongodbWorkForce');
  const { Schema } = mongooseClient;
  const dependents = new Schema({
    dependentDetails: {
      dependentName: String,
      relationShip: [String],
      dateOfBirth: Date,
      visaType: [String],
      contactEmail: String,
      contactNumber: String
    },
    attachments: {
      documentType: [String],
      documentStatus: [String],
      validUntil: Date,
      title: String,
      comments: String
    }
  }, {
    timestamps: true
  });

  return mongooseClient.model('dependents', dependents);
};
