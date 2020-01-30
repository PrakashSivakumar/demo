const assert = require('assert');
const app = require('../../src/app');

describe('\'inventory\' service', () => {
  it('registered the service', () => {
    const service = app.service('inventory');

    assert.ok(service, 'Registered the service');
  });
});
