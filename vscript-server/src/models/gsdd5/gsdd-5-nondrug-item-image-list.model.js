// gsdd5-NondrugItem_ImageList-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const gsdd5NondrugItemImageList = new Schema({
    Identifier: String,
    IdentifierType: String,
    ImageName: String,
    OrigFileName: String,
    NondrugItemImageId: Number,
    NondrugItemId: Number,
    Version: Number,
    ModifiedDate: String
  }, {
    timestamps: true
  });
  gsdd5NondrugItemImageList.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('gsdd5NondrugItemImageList', gsdd5NondrugItemImageList);
};
