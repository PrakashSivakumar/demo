// f5RejectCode-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');

  const { Schema } = mongooseClient;
  const f5RejectCode = new Schema({
    rejectCode: {
      type: String,
      unique: true
    },
    explanation: String,
    fieldPossiblyInError: String,
    fieldLimitation: String
  },{
    timestamp:true
  });

  f5RejectCode.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });

  return mongooseClient.model('f5RejectCode', f5RejectCode);
};
