// users-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientVscript');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const users = new Schema({
    username: {
      type: String,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    name: {
      firstName: String,
      middleName: String,
      lastName: String,
    },
    address: {
      addressLine1: String,
      addressLine2: String,
      city: String,
      state: String,
      zip: String,
      country: {
        type: String,
        enum: ['US']
      },
    },
    contact: {
      phone: String,
      faxNumber: String,
      email: String,
    },
    stats: {
      isActive: {
        type: Boolean,
        default: true,
      },
      createRx: {
        type: Boolean,
        default: false,
      },
      allActions: {
        type: Boolean,
        default: false,
      },
      createdDate: {
        type: Date,
        default: Date.now,
      },
      updatedDate: Date,
    },
    details: {
      pharmacy_id: [{
        type: Schema.ObjectId,
        ref: 'pharmacy',
      }],
      licenseNumber: String,
      licenseExpiry: Date,
      ownerOfCSV: String,
      consultingExpiry: Date,
      vscriptAccess: {
        type: [String]
      },
      patient_id: Schema.ObjectId,
    },
    roles: {
      type: [String],
      required: true,
      enum: ['admin', 'technician', 'patient', 'pharmacist', 'owner', 'counselling']
    },
    accessControls: {
      type: [String],
      enum: ['create', 'view', 'update', 'delete', 'annotate'],
    },
    isLoggedIn: Boolean,
    chain: String
  }, {
    timestamp: true
  });

  users.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });

  return mongooseClient.model('users', users);
};
