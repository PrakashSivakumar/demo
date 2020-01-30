// gsdd5-Price-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const { Schema } = mongooseClient;
  const gsdd5Price = new Schema({
    PackageID: {
      type: Number,
      index: true
    },
    PriceTypeID: {
      type: Number,
      index: true
    },
    PackagePrice: Number,
    CaseCount: Number,
    CasePrice: Number,
    BeginDate: Date,
    EndDate:Date,
    UnitPrice: Number,
    PriceChangeReasonID: Number,
    PackagePriceErrataID: Number,
    PackageSize: Number
  }, {
    timestamps: true
  });
  gsdd5Price.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('gsdd5Price', gsdd5Price);
};
