const assert = require('assert');
const app = require('../../src/app');

describe('\'twilio\' service', () => {
  it('registered the service', () => {
    const service = app.service('twilio');

    assert.ok(service, 'Registered the service');
  });
});
