const assert = require('assert');
const app = require('../../src/app');

describe('\'receiveRx\' service', () => {
  it('registered the service', () => {
    const service = app.service('receive-rx');

    assert.ok(service, 'Registered the service');
  });
});
