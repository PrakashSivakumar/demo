/ eslint-disable no-console /
const logger = require('./logger');
const app = require('./app');
const port = app.get('port');
const fs = require('fs');
const https = require('https');
const path = require('path');
process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

logger.info(port);





if (port === 443) {
  const privateKey = fs.readFileSync(path.join(__dirname, '/ssl/vscriptco_new/private.key'));
  const certificate = fs.readFileSync(path.join(__dirname, 'ssl/vscriptco_new/cert.crt'));

  const server = https.createServer({
    key: privateKey,
    cert: certificate,
    ca: [fs.readFileSync(path.join(__dirname, './ssl/vscriptco_new/g1')).toString(),
      fs.readFileSync(path.join(__dirname, './ssl/vscriptco_new/g2')).toString(),
      fs.readFileSync(path.join(__dirname, './ssl/vscriptco_new/g3')).toString()]
  }, app).listen(port, function () {
    logger.info('Feathers production application started on https://%s:%d', app.get('host'), port);
  });

  app.setup(server);

} else {
  const server = app.listen(port);

  server.on('listening', () =>
    logger.info('Feathers application started on http://%s:%d', app.get('host'), port)
  );
}


