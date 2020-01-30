// patient-counselling-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');

  const { Schema } = mongooseClient;
  const patientCounselling = new Schema({
    text: { type: String, required: true }
  }, {
    timestamps: true
  });
  patientCounselling.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('patientCounselling', patientCounselling);
};
