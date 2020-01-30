// Application hooks that run for every service
const log = require('./hooks/log');

const redisBefore = require('feathers-hooks-rediscache').redisBeforeHook;
const redisAfter = require('feathers-hooks-rediscache').redisAfterHook;
const cache = require('feathers-hooks-rediscache').hookCache;
const auditLogs = require('./hooks/audit-logs');
const accessControl = require('./hooks/access-controls');

module.exports = {
  before: {
    all: [
      log(),
     /* accessControl()*/
    ],
    find: [],
    get: [],
    // find: [redisBefore()],
    // get: [redisBefore()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [ log()],
    find: [
      auditLogs()
    ],
    get: [auditLogs()],
    // find: [cache({duration: 3600 * 24 * 7}), redisAfter()],
    // get: [cache({duration: 3600 * 24 * 7}), redisAfter()],
    create: [
      auditLogs()
    ],
    update: [
      auditLogs()
    ],
    patch: [
      auditLogs()
    ],
    remove: [
      auditLogs()
    ]
  },

  error: {
    all: [ log(),
      auditLogs()
    ],
    find: [],
    get: [],
    create: [
      auditLogs()
    ],
    update: [
      auditLogs()
    ],
    patch: [
      auditLogs()
    ],
    remove: [
      auditLogs()
    ]
  }
};
