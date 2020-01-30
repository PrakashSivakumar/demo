const assert = require('assert');
const app = require('../../src/app');

describe('\'rxLogs\' service', () => {
  it('registered the service', () => {
    const service = app.service('rx-logs');

    assert.ok(service, 'Registered the service');
  });
});
