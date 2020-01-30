// countercollection-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const countercollection = new Schema({
    image_id : { type: Number,Default : 0 },
    image_id1 : { type: Number,Default : 0 },
    image_id2 : { type: Number,Default : 0 },
    image_id3 : { type: Number,Default : 0 }
  }, {
    timestamps: true
  });

  return mongooseClient.model('countercollection', countercollection);
};
