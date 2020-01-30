// workforce/education-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongodbWorkForce');
  const { Schema } = mongooseClient;
  const education = new Schema({
    education: String,
    fieldOfStudy: String,
    institute: String,
    gpaPercentage: String,
    startDate: Date,
    endDate: Date,
    address: String,
    country: [String],
    state: String,
    city: String,
    comments: String
  }, {
    timestamps: true
  });

  return mongooseClient.model('education', education);
};
