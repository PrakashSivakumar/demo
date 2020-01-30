// audit-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {Schema} = mongooseClient;
  const audit = new Schema({
    atype: String,
    ts: {$date: Date},
    local: {ip: String, port: Number},
    remote: {ip: String, port: Number},
    users: [{user: String, $db: String}],
    roles: [{role: String, $db: String}],
    param: {
      command: String,
      ns: String,
      args: {
        find: String,
        filter: {},
        limit: Number,
        returnKey: Boolean,
        showRecordId: Boolean,
        lsid: {id: {$binary: String, $type: String}},
        $db: String
      }
    },
    result: Number
  }, {
    timestamps: true
  });

  return mongooseClient.model('audit', audit);
};
