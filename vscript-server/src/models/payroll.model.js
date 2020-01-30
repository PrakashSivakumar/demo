// payroll-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const payroll = new Schema({
    employeeName: String,
    store: String,
    regularHours: String,
    overTime: String,
    totalHours: String,
    hourlyRate: String,
    tax: String,
    netPay: String
  }, {
    timestamps: true
  });

  return mongooseClient.model('payroll', payroll);
};
