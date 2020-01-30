// productOrder-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');
  const {Schema} = mongooseClient;
  const productOrder = new Schema({
      packageId: String,
      UPC: Number,
      NDC11: Number,
      UnitPrice: Number,
      AWPUnitPrice: Number,
      RESUnitPrice: String,
      DrugName: String,
      Brand: String,
      VendorProductNumber: Number,
      Invoiced: String,
      inHandQty: Number,
      DrugType: String,
      orderedQuantity: Number,
      unitOfMeasure: String,
      dirUnitPrice: Number,
      deaClassificationId: Number,
      packageSize: Number,
      productId: Number,
      form: String,
      strength: String,
      unitCode: String,
      DrugDescription: String,
    },
    {
      timestamps: true
    });

  productOrder.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });

  return mongooseClient.model('productOrder', productOrder);
};
