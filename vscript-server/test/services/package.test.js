const assert = require('assert');
const app = require('../../src/app');

describe('\'package\' service', () => {
  it('registered the service', () => {
    const service = app.service('package');

    assert.ok(service, 'Registered the service');
  });
});
