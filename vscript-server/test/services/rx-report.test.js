const assert = require('assert');
const app = require('../../src/app');

describe('\'rx-report\' service', () => {
  it('registered the service', () => {
    const service = app.service('rx-report');

    assert.ok(service, 'Registered the service');
  });
});
