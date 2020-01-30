// gsdd5Allergy-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const { Schema } = mongooseClient;
  const gsdd5Allergy = new Schema({
    AllergyClassID: Number,
    AllergyName: String,
    AllergyDescription: String
  }, {
    timestamps: true
  });

  gsdd5Allergy.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });

  return mongooseClient.model('gsdd5Allergy', gsdd5Allergy);
};
