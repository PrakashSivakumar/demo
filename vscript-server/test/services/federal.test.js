const assert = require('assert');
const app = require('../../src/app');

describe('\'federal\' service', () => {
  it('registered the service', () => {
    const service = app.service('federal');

    assert.ok(service, 'Registered the service');
  });
});
