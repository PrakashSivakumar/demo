// message-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');

  const { Schema } = mongooseClient;
  const message = new Schema({
    sender: {type: Schema.ObjectId, required: true},
    content: {type: String, required: true},
    conversation_id:{
      type:Schema.ObjectId,
      ref:'conversation'
    }
  }, {
    timestamps: true
  });
  message.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('message', message);
};
