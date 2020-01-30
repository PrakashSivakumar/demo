// audit-logs-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {Schema} = mongooseClient;
  const auditLogs = new Schema({
    userId: Schema.ObjectId,
    pharmacyId: [{
      type: Schema.ObjectId,
      ref: 'pharmacy',
    }],
    username: String,
    rxId: String,
    patient: String,
    prescriber: String,
    drug: String,
    dea: String,
    messageId: String,
    data: String,
    updateFields: [String],
    previousValues: [String],
    currentValues: [String],
    service: String,
    method: String,
    description: String,
    outcome: String,
  }, {
    timestamps: true
  });

  return mongooseClient.model('auditLogs', auditLogs);
};
