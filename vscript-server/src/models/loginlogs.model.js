// loginlogs-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const loginlogs = new Schema({
    userId: String,
    username: String,
    password: String,
    messageId: String,
    data: String,
    service: String,
    method: String,
    description: String,
    outcome: String,
  }, {
    timestamps: true
  });

  return mongooseClient.model('loginlogs', loginlogs);
};
