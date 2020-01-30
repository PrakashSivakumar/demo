// gsdd5-package-image-list-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');
  const {Schema} = mongooseClient;
  const gsdd5PackageImageList = new Schema({

    Identifier: String,
    IdentifierType: String,
    ImageName: String,
    OrigFileName: String,
    PackageImageId: Number,
    PackageId: Number,
    Version: Number,
    ModifiedDate: String

  }, {
    timestamps: true
  });
  gsdd5PackageImageList.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('gsdd5PackageImageList', gsdd5PackageImageList);
};
