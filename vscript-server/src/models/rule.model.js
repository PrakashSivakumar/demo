// rule-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const d = new Date();
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const rule = new Schema({
    name: { type: String, required: true },
    store:[{
      name: String,
      id: Schema.ObjectId,
      refills: Number,
      claims: Number,
      itemType: String,
      username: String,
      store: String,
    }],
    user:[{
      name: String,
      username: String,
      refills: Number,
      claims: Number,
      id: Schema.ObjectId,
      itemType: String,
      store: String,
    }],
    expiryDate: {
      type: Date,
      default: d.setDate(d.getDate()+7)
    },
    direction: {
      type:String,
      enum: ['ltr', 'rtl'],
      default: 'ltr'
    },
  }, {
    timestamps: true
  });

  return mongooseClient.model('rule', rule);
};
