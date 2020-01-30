// notification-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const notification = new Schema({
    triggeredBy: {type: Schema.ObjectId,
      // required: true,
      ref: 'users'},
    notify: [{
      user_id: {
        type: Schema.ObjectId,
        ref: 'users',
      },
      status: {
        type: String,
        default: 'notify',
        enum: ['read', 'notified', 'notify','unread', 'accepted', 'rejected', 'ended']
      },
      readTimeStamp: Date,
    }],
    notification: {type: String, required: true},
    typeStatus:{type:String},
    notificationType: {
      type: String,
      enum: ['rx', 'message', 'video', 'voice', 'patient', 'prescriber', 'product', 'InvalidEPCS', 'ERx', 'ERx Refill Response', 'CancelRx','Order', 'TransferRx', 'orderhistory','refill request','talkpharmacy']
    },
    pharmacy_id: {
      type: Schema.ObjectId,
      ref: 'pharmacy',
    },
    data: String,
    role: [String]
  }, {
    timestamps: true,
  });
  notification.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('notification', notification);
};
