// const mongoose = require('mongoose');
const Mongoose = require('mongoose').Mongoose;
const mongoosastic = require('mongoosastic');

module.exports = function (app) {
  // mongoose.connect(app.get('mongodb'), { useNewUrlParser: true });
  // mongoose.Promise = global.Promise;

  // let conn = mongoose.createConnection(app.get('mongodb'), { useNewUrlParser: true });
  // conn.Promise = global.Promise;
  //
  // let connGSDD5 = mongoose.createConnection(app.get('mongodbGSDD5'), { useNewUrlParser: true });
  // connGSDD5.Promise = global.Promise;
  //
  // app.set('mongooseClient', conn.base);
  // app.set('mongooseClientGSDD5', connGSDD5.base);
  //
  // // console.log(app.get('mongooseClient'))
  // console.log(app.get('mongooseClientGSDD5'))

  const options = {
    useNewUrlParser: true,
    useCreateIndex: true,
    // autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 5000, // Reconnect every 500ms
    poolSize: 100, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    // bufferMaxEntries: 0,
    connectTimeoutMS: 100000, // Give up initial connection after 10 seconds
    socketTimeoutMS: 900000, // Close sockets after 45 seconds of inactivity
  };

  let connOcr = new Mongoose();
  connOcr.connect(app.get('mongodbOCR'), options);
  connOcr.Promise = global.Promise;

  let connDM = new Mongoose();
  connDM.connect(app.get('mongodbDigitalMarketing'), options);
  connDM.Promise = global.Promise;

  let connWFM = new Mongoose();
  connWFM.connect(app.get('mongodbWorkForce'), options);
  connWFM.Promise = global.Promise;

  let connWFMUsers = new Mongoose();
  connWFMUsers.connect(app.get('mongodbWFUsers'), options);
  connWFMUsers.Promise = global.Promise;

  let conn = new Mongoose();
  conn.connect(app.get('mongodb'), options);
  conn.Promise = global.Promise;

  let connGSDD5 = new Mongoose();
  connGSDD5.connect(app.get('mongodbGSDD5'), options);
  connGSDD5.Promise = global.Promise;

  let connVscript = new Mongoose();
  connVscript.connect(app.get('mongodbVscript'), options);
  connVscript.Promise = global.Promise;

  let connCommon = new Mongoose();
  connCommon.connect(app.get('mongodbCommon'), options);
  connCommon.Promise = global.Promise;

  let connSysaccess = new Mongoose();
  connSysaccess.connect(app.get('mongodbSysaccess'), options);
  connCommon.promise = global.Promise;

  app.set('mongooseClientOCR', connOcr);
  app.set('mongodbDigitalMarketing', connDM);
  app.set('mongodbWorkForce', connWFM);
  app.set('mongodbWFUsers', connWFMUsers);
  app.set('mongooseClient', conn);
  app.set('mongooseClientGSDD5', connGSDD5);
  app.set('mongooseClientVscript', connVscript);
  app.set('mongooseClientCommon', connCommon);
  app.set('mongooseClientAccess', connSysaccess);
  app.set('mongoosastic', mongoosastic);

};
