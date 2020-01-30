// rxLogs-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {Schema} = mongooseClient;
  const rxLogs = new Schema({
    rxId: {
      type: Number
    },
    isPriorty: Boolean,
    rxType: {
      type: String,
      default: 'internal',
      enum: ['internal', 'external', null, '', 'myrx']
    },
    updateFields: [{
      type: String
    }],
    patient_id: {
      type: Schema.ObjectId,
      ref: 'patient',
    },
    productDetails: {
      productName: {
        type: Schema.ObjectId,
        ref: 'gsdd5-product',
      },
      name: String,
      DEAClass: Number
    },
    claimLogs_id: [{
      type: Schema.ObjectId,
      ref: 'claimLog'
    }],
    digitalSignature: [{
      type: String
    }],
    prescriber_id: {
      type: Schema.ObjectId,
      ref: 'prescriber',
    },
    prescriberLocationName: String,
    product_id: {
      type: Number
    },
    pharmacy_id: {
      type: Schema.ObjectId,
      ref: 'pharmacy',
    },
    refills: {
      fills: [new Schema({
        daw: Number,
        unitOfMeasure: String,
        rxOriginCode: String,
        iou: {
          type: Number,
          default: 0,
        },
        billTo: {
          type: String,
        },
        sig: {
          code: {
            type: String,
          },
          description: {
            type: String,
          },
        },

        number: Number,
        quantityDispensed: Number,
        daysSupply: Number,
        usualAndCustomerCharge: Number,
        user: {
          username: String,
          lastAction: String,
          outcome: String,
          dispensingFee: {
            type: Number,
            Default: 5,
          },
        },
        billing: {
          billingType: String,
          insurance: {
            planId: String,
            name: String,
            insurancePaid: Number,
            ingredientCostPaid: Number,
            dispensingFeePaid: Number,
            flatSalesTax: Number,
            salesTaxRate: Number,
            SalesTaxBasis: Number,
            percentOfSalesTax: Number,
          },
          patientPaid: Number,
          acqPrice: Number,
          awpPrice: Number,
          billed: Number,
          totalPaid: Number,
          profitMargin: Number,
        },
        package: {
          package_id: {
            type: Schema.ObjectId,
            ref: 'package'
          },
          package_priceId: Number,
        },
        amount: {
          cashPrice: Number,
          price: Number,
        },
        reject: {
          comment: String,
          reasonType: String,
        },
        status: {
          type: String,
        },
        deliveryMethod: String,
        notes: {
          comment: String,
          note: String,
        },
        orderedQuantity: Number,
        verificationStatus: {
          type: String,
        },
        fillDate: {
          type: Date,
        }
      }, {
        timestamps: true
      })],
      endRefillDate: String,
      orderDate: Date,
      total: Number,
    },
    transfers: {
      pharmacy_id: {
        from: String,
        to: String,
      },
      transferType: {
        type: String,
        enum: ['Transfer Out', 'Transfer In', null, ''],
      },
      toPharmDetails: {
        toPharmName: String,
        toPharmAddress: String,
        toPharmCity: String,
        toPharmState: String,
        toPharmDeanumber: String,
        toPharmZip: Number,
        toPharmPhone: Number,
        toPharmFax: Number,
        otherPharmacistName: String,
        pharmacistName: String,
      },
      dates: {
        writtenDate: Date,
        firstFillDate: Date,
        lastFillDate: Date,
        transferDate: {
          type: Date,
          default: Date.now(),
        },
      },
      rxNumber: {
        from: Number,
        to: Number,
      },
      remarks: String,
    },
    action: String,
  }, {
    timestamps: true,
  });
  return mongooseClient.model('rxLogs', rxLogs);
};
