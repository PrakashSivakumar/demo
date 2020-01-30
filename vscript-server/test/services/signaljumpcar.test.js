const assert = require('assert');
const app = require('../../src/app');

describe('\'signaljumpcar\' service', () => {
  it('registered the service', () => {
    const service = app.service('signaljumpcar');

    assert.ok(service, 'Registered the service');
  });
});
