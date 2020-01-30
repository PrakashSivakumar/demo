// pmpLog-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');

  const { Schema } = mongooseClient;

  //TODO Ramesh Charan Low
  const pmpLog = new Schema({
    pmpLogId: {
      type: Number,
      unique: true,
    },
    rxId: Number,
    fillNumber: Number,
    submittedDate: Date,
    transactionNumber: String,
  },{
    timestamp:true
  });
  pmpLog.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('pmpLog', pmpLog);
};
