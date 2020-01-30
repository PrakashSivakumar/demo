const assert = require('assert');
const app = require('../../src/app');

describe('\'sigCode\' service', () => {
  it('registered the service', () => {
    const service = app.service('sig-code');

    assert.ok(service, 'Registered the service');
  });
});
