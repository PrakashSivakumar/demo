// gsdd5-Marketed_Product-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const { Schema } = mongooseClient;
  const gsdd5MarketedProduct = new Schema({
    MarketedProductID: {
      type:Number,
      index:true
    },
    Name: String,
    SpecificProductID: Number,
    Brand: Boolean,
    Repackaged: Boolean
  }, {
    timestamps: true
  });
  gsdd5MarketedProduct.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('gsdd5MarketedProduct', gsdd5MarketedProduct);
};
