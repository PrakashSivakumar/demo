// callEnd-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const callEnd = new Schema({
    callEnded: {
      type: Boolean,
      default: false
    },
    patientCallEnded: {
      type: Boolean,
      default: false
    }
  }, {
    timestamps: true
  });

  return mongooseClient.model('callEnd', callEnd);
};
