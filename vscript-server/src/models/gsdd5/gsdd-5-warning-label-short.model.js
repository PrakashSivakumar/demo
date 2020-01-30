// gsdd5-Warning_Label_Short-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const gsdd5WarningLabelShort = new Schema({
    WarningLabelID: {
      type: Number,
      index: true
    },
    LanguageCode: String,
    WarningLabelGroupID: {
      type: Number,
      index: true
    },
    Warning: String
  }, {
    timestamps: true
  });
  gsdd5WarningLabelShort.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('gsdd5WarningLabelShort', gsdd5WarningLabelShort);
};
