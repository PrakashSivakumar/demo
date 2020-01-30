
module.exports = function(app) {
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const product = new Schema({
    assignedIdentification: Number,
    quantityInvoiced: Number,
    unitforMeasurement: String,
    unitPrice: Number,
    productOrServiceIDQualifier: String,
    productOrServiceID: String,
    NDC11Qualifier: String,
    NDC11: String,
    itemDescriptionType: String,
    PID03: String,
    PID04: String,
    itemDescription: String,
    DeaClassificationId: Number,
    ProductId: Number,
    NDC9: String
  }, {
    timestamp: true,
  });

  product.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('product', product);
};
