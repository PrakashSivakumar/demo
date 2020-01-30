// gsdd5-GSTerms-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const { Schema } = mongooseClient;
  const gsdd5GsTerms = new Schema({
    GSTermId: {
      type:Number,
      index:true
    },
    Name: String,
    AllowedForIndication: Boolean,
    AllowedForContraindication: Boolean,
    AllowedForAdverseReaction: Boolean
  }, {
    timestamps: true
  });
  gsdd5GsTerms.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('gsdd5GsTerms', gsdd5GsTerms);
};
