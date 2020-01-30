// gssd5-Federal-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const gssd5Federal = new Schema({
    NDC11: {
      type: Number,
      index: true
    },
    PackageID: {
      type:Number,
      index: true
    },
    ProductID: {
      type:Number,
      index: true
    },
    ProductNameShort: String,
    LicenseTypeID: Number,
    FDALicenseNumber: Number,
    MedGuide: Boolean,
    Dilution: Boolean,
    DEAClassificationID: Number,
    LegendStatusID: Number,
    REMSFlag: Boolean
  }, {
    timestamps: true
  });

  gssd5Federal.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });

  return mongooseClient.model('gssd5Federal', gssd5Federal);
};
