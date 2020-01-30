// gsdd5-Warning_Label_Group-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const gsdd5WarningLabelGroup = new Schema({
    WarningLabelGroupID: {
      type: Number,
      index: true
    },
    GroupName: String
  }, {
    timestamps: true
  });
  gsdd5WarningLabelGroup.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('gsdd5WarningLabelGroup', gsdd5WarningLabelGroup);
};
