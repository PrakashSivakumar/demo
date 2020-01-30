// timeSheets-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');
  const { Schema } = mongooseClient;
  const timeSheets = new Schema({
    user_id: {
      type: Schema.ObjectId,
      ref: 'users',
    },
    userName: String,
    role: String,
    pharmacy_id: {
      type: Schema.ObjectId,
      ref: 'pharmacy',
    },
    pharmacyName: String,
    checkInTime: Date,
    checkOutTime: Date,
    regularHours: Number,
    totalWorkingHours: String,
    overTime: String,
    hourlyRate: Number,
    tax: String,
    netPay: String
  }, {
    timestamps: true
  });

  // timeSheets.plugin(mongoosastic,{
  //   hosts: [
  //     app.get('elasticSearch')
  //   ]
  // });

  return mongooseClient.model('timeSheets', timeSheets);
};
