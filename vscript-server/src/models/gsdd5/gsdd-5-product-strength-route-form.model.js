// gsdd5-Product_Strength_Route_Form-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const gsdd5ProductStrengthRouteForm = new Schema({
    ProductID: {
      type: Number,
      index: true
    },
    IngredientID: Number,
    IngredientName: String,
    Strength: Number,
    StrengthUnitCode: String,
    RouteID: Number,
    RouteName: String,
    FDAFormID: Number,
    FDAForm: String,
    GSFormID: Number,
    GSForm: String,
    AlternativeFormID: Number,
    AlternativeFormName: String,
    ClinicalDoseFormID: Number,
    ClinicalDoseFormName: String,
    NormalizedFormID: Number,
    NormalizedFormName: String,
    TopLevelDoseFormID: Number,
    TopLevelDoseFormName: String
  }, {
    timestamps: true
  });
  gsdd5ProductStrengthRouteForm.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('gsdd5ProductStrengthRouteForm', gsdd5ProductStrengthRouteForm);
};
