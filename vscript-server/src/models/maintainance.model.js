// maintainance-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {Schema} = mongooseClient;
  const maintainance = new Schema({
    maintain: {
      type: Boolean,
      default: false
    },
    fromDate: {
      type: String
    },

    toDate: {
      type: String
    },

  }, {
    timestamps: true
  });
  return mongooseClient.model('maintainance', maintainance);
};
