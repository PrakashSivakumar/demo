// workforce/skills-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongodbWorkForce');
  const { Schema } = mongooseClient;
  const skills = new Schema({
    skillsetDetails: {
      skill: String,
      yearsOfExperience: Number,
      certificationFileName: String,
      comments: String
    },
    languages: {
        language: [String],
        fluency: [String]
    }
  }, {
    timestamps: true
  });

  return mongooseClient.model('skills', skills);
};
