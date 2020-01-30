// wfusers-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongodbWFUsers');
  const { Schema } = mongooseClient;

  const wfusers = new Schema({
    username: {
      type: String,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      firstName: String,
      middleName: String,
      lastName: String,
    },
    address: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      zip: String,
      country: {
        type: String,
        enum: ['US']
      },
    },
    contact: {
      phone: String,
      faxNumber: String,
      email: String,
    }
  }, {
    timestamp: true
  });

  return mongooseClient.model('wfusers', wfusers);
};
