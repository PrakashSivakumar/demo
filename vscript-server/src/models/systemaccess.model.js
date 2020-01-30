// systemaccess-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientAccess');
  const { Schema } = mongooseClient;
  const systemaccess = new Schema({
    user: { type: String},
    reason:{type:String},
    service:{type:String},
    method:{type:String},
    accountTypes:{
      type: String,
      enum: ['individual', 'shared/group', 'system','application','guest/anonymous','emergency ','temporary'],
    },
    conditions:[{
      type: String,
    }],
  }, {
    timestamps: true
  });

  return mongooseClient.model('systemaccess', systemaccess);
};
