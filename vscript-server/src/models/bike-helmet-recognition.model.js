// bikeHelmetRecognition-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClientOCR = app.get('mongooseClientOCR');
  const mongoosastic = app.get('mongoosastic');
  const { Schema } = mongooseClientOCR;
  const bikeHelmetRecognitions = new Schema({
    location: String,
    np_loc_path: String,
    np_no: String,
    z_helmet: String,
    z_z_timestamp: String,
  }, {
    timestamps: true
  });

  bikeHelmetRecognitions.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClientOCR.model('bikeHelmetRecognitions', bikeHelmetRecognitions);
};
