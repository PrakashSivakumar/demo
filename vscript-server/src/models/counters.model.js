// counters-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const {Schema} = mongooseClient;
  const counters = new Schema({
    rxId2: {
      type: Number,
      Default: 2000
    },
    rxId3: {
      type: Number,
      Default: 0
    },
    rxId4: {
      type: Number,
      Default: 4000
    },
    rxId6: {
      type: Number,
      Default: 6000
    },

  }, {
    timestamps: true
  });

  return mongooseClient.model('counters', counters);
};

