// pharmacy-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');

  const { Schema } = mongooseClient;
  const pharmacy = new Schema({
    npi: {
      type: Number,
      unique: true,
    },
    ncpdpId: {
      type: Number,
      unique: true,
    },
    pharmacyType: {
      type: String,
      enum: ['Pharmacy', 'Telepharmacy'],
    },
    name: {
      type:String,
      lowercase: true,
    },
    telePharmacyName: {
      type: String,
      lowercase: true,
    },
    contact: {
      phone: String,
      email: String,
      officePhone: String,
      fax: String,
    },
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    details: {
      storeImage: String,
      xwebId: String,
      xwebTerminalId: String,
      xwebAuthkey:String,
      deaNumber: String,
      logo:String
    },
    db: {
      rxcount: Number,
      claimreceivals: Number,
      cashreceivals: Number,
      sales: Number,
      margin:Number,
      rxrefills: Number
    },
    vscriptAccess:{
      type: String,
      enum: ['full', 'lite'],
      required:true,
    }

  },{
    timestamp:true
  });
  pharmacy.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });

  return mongooseClient.model('pharmacy', pharmacy);
};
