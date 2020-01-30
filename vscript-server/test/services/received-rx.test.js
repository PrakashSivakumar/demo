const assert = require('assert');
const app = require('../../src/app');

describe('\'receivedRx\' service', () => {
  it('registered the service', () => {
    const service = app.service('received-rx');

    assert.ok(service, 'Registered the service');
  });
});
