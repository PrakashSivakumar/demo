// gsdd5-GSTerm_ICD10-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const { Schema } = mongooseClient;
  const gsdd5GsTermIcd10 = new Schema({
  ICD10_Code: String,
    GSTermId: {
      type:Number,
      index:true
    },
    ICD10_Description: String
  }, {
    timestamps: true
  });
  gsdd5GsTermIcd10.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('gsdd5GsTermIcd10', gsdd5GsTermIcd10);
};
