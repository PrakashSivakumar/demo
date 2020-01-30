// gsdd5-Patient_Education_Int1-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClientGSDD5');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const gsdd5PatientEducationInt1 = new Schema({
    SheetId: {
      type:Number,
      index:true
    },
    LanguageCode: String,
    SHEET_NAME: String,
    DESCR: String,
    CONTRA: String,
    ADMIN: String,
    MISSED: String,
    INTER: String,
    MONITOR: String,
    SIDE: String,
    STORE: String,
    DESCR_HEADERID: Number,
    DESCR_FOOTERID: Number,
    CONTRA_HEADERID: Number,
    ADMIN_HEADERID: Number,
    ADMIN_FOOTERID: Number,
    MISSED_HEADERID: Number,
    INTER_HEADERID: Number,
    INTER_FOOTERID: Number,
    SIDE_HEADERID: Number,
    SIDE_FOOTERID: Number,
    MONITOR_HEADERID: Number,
    STORE_HEADERID: Number,
    STORE_FOOTERID: Number,
    LastUpdated: Date
  }, {
    timestamps: true
  });
  gsdd5PatientEducationInt1.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('gsdd5PatientEducationInt1', gsdd5PatientEducationInt1);
};
