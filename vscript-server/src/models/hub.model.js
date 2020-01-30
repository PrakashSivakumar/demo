// hub\-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const hub = new Schema({
    name: String,
    pharmacy:{
        pharmacies:[{
          id: {
            type: Schema.ObjectId
          },
          name: {type: String},
          technicians:[{id: Schema.ObjectId, username: {type: String}, userType : String}],
          pharmacists:[{id: Schema.ObjectId, username: {type: String}}]
        }]
      },
      pharmacists:[{id: Schema.ObjectId, username: {type: String},  userType : String}],
      technicians:[{id: Schema.ObjectId, username: {type: String}}]
  }, {
    timestamps: true
  });

  return mongooseClient.model('hub', hub);
};
