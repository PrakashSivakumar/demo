// workforce/employee-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongodbWorkForce');
  const { Schema } = mongooseClient;
  const employee = new Schema({
    contact_id: {
      type: Schema.ObjectId,
      ref: 'workforce-contact'
    },
    education_id: {
      type: Schema.ObjectId,
      ref: 'workforce-education'
    },
    workAuthorization_id: {
      type: Schema.ObjectId,
      ref: 'workforce-workauthorization'
    },
    dependents_id: {
      type: Schema.ObjectId,
      ref: 'workforce-dependents'
    },
    placements_id: {
      type: Schema.ObjectId,
      ref: 'workforce-placements'
    },
    skills_id: {
      type: Schema.ObjectId,
      ref: 'workforce-skills'
    },

    employeeId: Number,
    userName: String,
    type: String,
    nameDetails: {
      firstName: String,
      middleName: String,
      lastName: String
    },
    contactDetails: {
      contactNumber: Number,
      email: String,
      alternateEmail: String
    },
    country: [String],
    state: [String],
    jobTitle: [String],
    dateOfJoining: Date,
    employeeStatus: [String],
    gender: {
      type: String,
      enum: ['Male', 'Female']
    },
    ethnicity: [String],
    department: [String],
    role: [String],
    reportingManager: [String],
    fiananceManager: [String],
    hrManager: [String],
    classification: [String],
    category: [String],
    workAuthorization: [String],
    maritalStatus: [String],
    payrollID: String,
    holidayCalendar: [String],
    weekendProfile: [String],
    veteranStatus: [String]
  }, {
    timestamps: true
  });

  return mongooseClient.model('employee', employee);
};
