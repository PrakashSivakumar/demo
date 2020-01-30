// accesscontrol-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const accesscontrol = new Schema({
    role: {type: String, required: true},
    path: {type: String, required: true},
    method: [{type: String, require: true}]
  }, {
    timestamps: true
  });

  return mongooseClient.model('accesscontrol', accesscontrol);
};
