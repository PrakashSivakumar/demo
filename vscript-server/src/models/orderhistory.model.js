// orderhistory-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {Schema} = mongooseClient;
  const orderhistory = new Schema({
      _id: Schema.ObjectId,
      orderedItem: [new Schema({
          UPC: Number,
          NDC11: Number,
          UnitPrice: Number,
          AWPUnitPrice: Number,
          RESUnitPrice: String,
          DrugName: String,
          Brand: String,
          inHandQty: Number,
          VendorProductNumber: Number,
          Invoiced: String,
          DrugType: String,
          orderedQuantity: Number,
          unitOfMeasure: String,
          dirUnitPrice: Number,
          deaClassificationId: Number,
          packageSize: Number,
          form: String,
          strength: String,
          unitCode: String,
          DrugDescription: String,
          packCost: String,
          drugTotalPrice: Number,
        },
        {
          timestamps: true
        }
      )],
      totalPrice: Number
    },
    {
      timestamps: true
    });
  return mongooseClient.model('orderhistory', orderhistory);
};
