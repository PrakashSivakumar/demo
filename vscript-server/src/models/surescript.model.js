// surescript-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const surescript = new Schema({
    pharmacyNPI: Number,
    pharmacyNCPDPID: Number,
    rx_Id: {
      type: Schema.ObjectId,
      ref: 'rx',
    },
    pon: String,
    patientName: String,
    prescriberName: String,
    rxNumber: Number,
    notificationFrom: String,
    prescriber_npi: Number,
    receipientId: Number,
    senderId: String,
    messageId: String,
    sentDateTime: Date,
    rxType: {
      type: String,
      enum: ['new','Refill','Cancel', 'myrx'],
    },
    deleted: {
      type: String,
      enum: ['true','false']
    },
    message: String,
    status: {
      type:String,
      enum: ['read', 'unread']
    }
  }, {
    timestamps: true
  });

  return mongooseClient.model('surescript', surescript);
};
