// gsdd5-product-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const { Schema } = mongooseClient;
  const gsdd5Product = new Schema({
    ProductID: {
      type:Number,
      index:true
    },
    NDC9: String,
    ProductNameLong: String,
    ProductNameTypeID: Number,
    ProductNameShort: String,
    ePrescribingName: String,
    MarketerID: Number,
    DESIStatusID: Number,
    DEAClassificationID: Number,
    BrandGenericStatusID: Number,
    LegendStatusID: Number,
    MarketedProductID: Number,
    CP_NUM: Number,
    LicenseTypeID: Number,
    Repackaged: Boolean,
    Innovator: Boolean,
    PrivateLabel: Boolean,
    ProductOnMarketDate: Date,
    BulkChemical: Boolean,
    LimitedDistributionID: Number
  },{
    timestamps: true,
  });
  gsdd5Product.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });

  gsdd5Product.index({ProductNameLong: 1, ProductNameShort: 1});

  return mongooseClient.model('gsdd5Product', gsdd5Product);
};
