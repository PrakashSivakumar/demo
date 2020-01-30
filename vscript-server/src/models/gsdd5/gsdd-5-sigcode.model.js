// gsdd5-Sigcode-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const gsdd5Sigcode = new Schema({
    SIGCODE: {
      type: String,
      index: true
    },
    SIGL1: String,
    SIGL2: String,
    SIGL3: String,
    SIGL12: String,
    SIGL22: String,
    SIGL32: String,
    DAILYDOSE: String,
    PRIORITY: String,
    CREATIONDATE: String,
    LASTMODIFIED: String,
    DOSESCHEDULEID: String,
  }, {
    timestamps: true
  });
  gsdd5Sigcode.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('gsdd5Sigcode', gsdd5Sigcode);
};
