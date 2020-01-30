// videothisweek-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClientDM = app.get('mongodbDigitalMarketing');
  const { Schema } = mongooseClientDM;
  const videothisweek = new Schema({
    title: String,
    content: String,
    production: String,
    productionVideoLink: String,
    editing: String,
    editingVideoLink: String,
    publicationStatus: String,
    publishDate: Date
  }, {
    timestamps: true
  });

  return mongooseClientDM.model('videothisweek', videothisweek);
};
