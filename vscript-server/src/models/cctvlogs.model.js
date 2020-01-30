// cctvlogs-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const cctvlogs = new Schema({
    userId: Schema.ObjectId,
   /* pharmacyId: [{
      type: Schema.ObjectId,
      ref: 'pharmacy',
    }],*/
    username: String,

    rx_Id:Schema.ObjectId,
    /*rxId: String,
    pharmacyName: {
      type: String,
      lowercase: true,
    },*/
  }, {
    timestamps: true
  });

  return mongooseClient.model('cctvlogs', cctvlogs);
};
