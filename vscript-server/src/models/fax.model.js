// fax-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');

  const { Schema } = mongooseClient;
  const fax = new Schema({
    rxId: Number,
    fromFaxNumber: Number,
    fromName: String,
    toFaxNumber: Number,
    toName: String,
    faxData: String,
    date: {
      type: Date,
      default: Date.now,
    },
    byUser: Number,
    faxDate: {
      type: Date,
      default: Date.now,
    },
    toEmail: String,
    notes: String,
  },{
    timestamp:true
  });
  fax.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });

  return mongooseClient.model('fax', fax);
};
