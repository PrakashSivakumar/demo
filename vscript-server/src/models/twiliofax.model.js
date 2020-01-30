// twiliofax-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {Schema} = mongooseClient;
  const twiliofax = new Schema({
    faxSubject: String,
    fromName: String,
    fromFaxNumber: String,
    notes: String,
    toName: String,
    toFaxNumber: String,
    toEmail: String,
    date: Date,
    rxId: Number,
    status: String,
    userId: {
      type: Schema.ObjectId,
      ref: 'users'
    },
  }, {
    timestamps: true
  });
  return mongooseClient.model('twiliofax', twiliofax);
};
