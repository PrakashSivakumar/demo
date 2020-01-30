// conversation-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const conversation = new Schema(
    {
      participants: [Schema.ObjectId],
      message: {
        status: {
          type: String,
          enum: ['notified', 'notify'],
        }
      },
      voice: {
        status: {
          type: String,
          enum: ['accepted', 'on-going', 'done', 'notify', 'notified', 'rejected'],
        }
      },
      video: {
        status: {
          type: String,
          enum: ['accepted', 'on-going', 'done', 'notify', 'notified', 'rejected'],
        }
      },
    }, {
      timestamps: true
    });

  conversation.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });

  return mongooseClient.model('conversation', conversation);
};
