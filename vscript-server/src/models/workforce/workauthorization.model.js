// workforce/workauthorization-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongodbWorkForce');
  const { Schema } = mongooseClient;
  const workauthorization = new Schema({
    workAuthorization: {
      country: [String],
      documentStatus: String,
      documentNumber: String,
      dateIssued: Date,
      validFrom: Date,
      expiryDate: Date,
      comments: String
    },
    attachments: {
        attachmentName: String,
        comments: String
    }
  }, {
    timestamps: true
  });

  return mongooseClient.model('workauthorization', workauthorization);
};
