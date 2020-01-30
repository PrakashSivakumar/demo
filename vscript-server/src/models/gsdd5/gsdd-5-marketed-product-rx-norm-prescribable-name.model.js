// gsdd5-Marketed_Product_RxNorm_Prescribable_Name-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const { Schema } = mongooseClient;
  const gsdd5MarketedProductRxNormPrescribableName = new Schema({
    MarketedProductRxNormPrescribableNameID: {
      type:Number,
      index:true
    },
    MarketedProductID: {
      type:Number,
      index: true
    },
    RXCUI: Number,
    RxNormName: String,
    RxNormType: String,
    RxNormPSN: String,
    RxNormTMSY: String,
    RxNormSY: String
  }, {
    timestamps: true
  });
  gsdd5MarketedProductRxNormPrescribableName.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('gsdd5MarketedProductRxNormPrescribableName', gsdd5MarketedProductRxNormPrescribableName);
};
