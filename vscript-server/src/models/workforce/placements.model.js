// workforce/placements-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongodbWorkForce');
  const { Schema } = mongooseClient;
  const placements = new Schema({
    jobCode: String,
    placementCode: String,
    jobTitle: String,
    client: String,
    jobStatus: String,
    startDate: Date,
    endDate: Date,
    projectedEndDate: Date,
    payRate: String,
    billRate: String,
    billingType: String,
    terminationNotice: String,
    createdDate: Date
  }, {
    timestamps: true
  });

  return mongooseClient.model('placements', placements);
};
