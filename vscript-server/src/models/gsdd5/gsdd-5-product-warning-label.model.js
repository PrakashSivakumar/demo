// gsdd5-Product_Warning_Label-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const gsdd5ProductWarningLabel = new Schema({
    ProductID: {
      type:Number,
      index:true
    },
    WarningLabelID: {
      type:Number,
      index: true
    },
    WarningOrder: Number
  }, {
    timestamps: true
  });
  gsdd5ProductWarningLabel.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('gsdd5ProductWarningLabel', gsdd5ProductWarningLabel);
};
