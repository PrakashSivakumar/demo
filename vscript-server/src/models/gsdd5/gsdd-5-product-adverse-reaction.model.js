// gsdd5-Product_Adverse_Reaction-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const gsdd5ProductAdverseReaction = new Schema({
    ProductID: {
      type: Number,
      index: true
    },
    SectionID: Number,
    GSTermID: {
      type:Number,
      index:true
    },
    IsBlackBox: Boolean,
    IncidenceFrom: Number,
    IncidenceTo: Number,
    Include: Boolean,
    Severity: String,
    Onset: String,
  }, {
    timestamps: true
  });
  gsdd5ProductAdverseReaction.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('gsdd5ProductAdverseReaction', gsdd5ProductAdverseReaction);
};
