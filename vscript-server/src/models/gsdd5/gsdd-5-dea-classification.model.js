// gsdd5-DEA_Classification-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const { Schema } = mongooseClient;
  const gsdd5DeaClassification = new Schema({
    DEAClassificationID: {
      type:Number,
      index:true
    },
    Classification: String
  }, {
    timestamps: true
  });
  gsdd5DeaClassification.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('gsdd5DeaClassification', gsdd5DeaClassification);
};
