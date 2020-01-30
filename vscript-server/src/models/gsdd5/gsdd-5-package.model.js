// gsdd5-package-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const gsdd5Package = new Schema({
    PackageID: {
      type:Number,
      index:true
    },
    NDC10: Number,
    NDC11: {
      type:Number,
      index: true
    },
    GTIN12: Number,
    GTIN14: Number,
    NCPDPBillingUnitID: Number,
    NCPDPScriptFormCode: Number,
    OuterPackageUnitID: Number,
    ProductID: Number,
    PackageDescription: String,
    PreservativeFree: Boolean,
    PackageOnMarketDate: Date,
    PackageSize: Number,
    NotSplittable: Boolean,
    ShortCycleDispensing: Boolean,
    ShortCycleDispensingIsManual: Boolean,
    MinimumDispenseQuantity: Number,
    MinimumDispenseQuantityIsManual: Boolean,
    UnitDoseTypeID: Number
  }, {
    timestamps: true
  });
  gsdd5Package.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('gsdd5Package', gsdd5Package);
};
