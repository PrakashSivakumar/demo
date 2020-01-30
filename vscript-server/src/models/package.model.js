
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');

  const { Schema } = mongooseClient;
  const package = new Schema({
    SerialNo: Number,
    PackageId: String,
    productOrServiceIDQuailifier1: String,
    productOrServiceID1: String,
    productOrServiceIDQuailifier2: String,
    productOrServiceID2: String,
    NDC11: String,
    NDC11Qualifier: String,
    itemDescriptionType: String,
    PID02: String,
    itemDescription: String,
    UnitOfMeasure: String,
    INVPrice: Number,
    AWPPrice: String,
    RESPrice: String,
    ManufacturedBy: String,
    ProductId: String,
    PackageSize: Number
  },{
    timestamp:true
  });

  package.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });

  return mongooseClient.model('package', package);
};
