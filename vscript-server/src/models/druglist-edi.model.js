// druglistEDI-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');
  const {Schema} = mongooseClient;
  const druglistEdi = new Schema({
      packageId: String,
      UPC: {type:Number,unique:true},
      NDC11: {type:Number,unique:true},
      UnitPrice: Number,
      AWPUnitPrice: Number,
      RESUnitPrice: String,
      DrugName: String,
      Brand: String,
      VendorProductNumber: Number,
      Invoiced: String,
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
      inHandQty: Number
    },
    {
      timestamps: true
    }
    )
  ;

  druglistEdi.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('druglistEdi', druglistEdi);
};
