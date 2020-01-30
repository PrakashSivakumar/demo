// dicejobs-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseJobs');
  const mongoosastic = app.get('mongoosastic');
  const {Schema} = mongooseClient;
  const dicejobs = new Schema({
    company: String,
    position: String,
    postDate: String,
    description: String,
    content: [String],
  }, {
    timestamps: true
  });
  dicejobs.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });

  return mongooseClient.model('dicejobs', dicejobs);
};
