// checkout-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const checkout = new Schema({
    invoiceNumber: {
      type: Number,
      required: true,
      unique: true,
    },
    pharmacy_id: {
      type: Schema.ObjectId,
      ref: 'pharmacy',
    },
    item: [{
      itemType: {
        type: String,
        enum: ['rx', 'non-rx'],
      },
      rxId: String,
      amount: Number,
      margin: Number,
      discountPercent: Number,
      id: String,
      description: String,
      qty: String,
      statusCode: String,
      ndc11: String,
      upc: String,

    }],
    updatedBy: String,
    pseudophedrinFlag: {
      value: String,
      firstName: String,
      lastName: String,
      idType: String,
      id: String,
      signature: String,
      patient_id: {
        type: String,
        ref: 'patient'
      }
    },
    price: {
      taxPercent: Number,
      taxAmount: Number,
      discountAmount: Number,
      totalAmount: Number,
      totalMargin: Number,
      balance: Number,
      amountTendered: Number
    },
    payment: {
      card: [{
        issuer: String,
        cardType: {
          type: String,
        },
        cardNumber: String,
        transactionId: Number,
        cardBrand: String,
        cardAmount: Number,
      }],
      cash: {
        cashAmount: Number,
      },
      check: {
        checkNumber: String,
        checkAmount: Number,
      }
    },
  }, {
    timestamps: true
  });

  checkout.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });


  return mongooseClient.model('checkout', checkout);
};
