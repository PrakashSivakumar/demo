// addEmployee-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongodbWorkForce');
  const { Schema } = mongooseClient;
  const addEmployee = new Schema({
    firstName: String,
    middleName: String,
    lastName: String,
    jobTitle: String,
    userName: String,
    email: String,
    altEmail: String,
    contactNumber: Number,
    gender: String,
    ethnicity: String,
    employmentType: String,
    employeeStatus: String,
    department: String,
    role: String,
    reportingManager: String,
    financeManager: String,
    hrManager: String,
    dateOfJoining: Date,
    location: String,
    category: String,
    classification: String,
    workAuthorization: String,
    payrollID: String,
    workerID: String,
    holidayCalendar: String,
    weekendProfile: String,
    veteranStatus: String
  }, {
    timestamps: true
  });

  return mongooseClient.model('addEmployee', addEmployee);
};
