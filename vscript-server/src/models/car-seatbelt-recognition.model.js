// carSeatbeltRecognition-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClientOCR = app.get('mongooseClientOCR');
  const mongoosastic = app.get('mongoosastic');
  const { Schema } = mongooseClientOCR;
  const carSeatbeltRecognitions = new Schema({
    np_loc_path: String,
    np_no: String,
    z_seat_belt: String,
    z_z_timestamp: String,
    location: String
  }, {
    timestamps: true
  });

  carSeatbeltRecognitions.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClientOCR.model('carSeatbeltRecognition', carSeatbeltRecognitions);
};
