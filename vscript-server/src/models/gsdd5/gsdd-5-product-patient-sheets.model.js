// gsdd5-Product_Patient_Sheets-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const gsdd5ProductPatientSheets = new Schema({
    ProductID: {
      type:Number,
      index:true
    },
    SheetID: Number,
    SheetName: String,
    GenericProductClinicalId: Number,
    LanguageCode: String
  }, {
    timestamps: true
  });
  gsdd5ProductPatientSheets.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('gsdd5ProductPatientSheets', gsdd5ProductPatientSheets);
};
