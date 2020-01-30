const assert = require('assert');
const app = require('../../src/app');

describe('\'f5RejectCode\' service', () => {
  it('registered the service', () => {
    const service = app.service('f-5-reject-code');

    assert.ok(service, 'Registered the service');
  });
});
