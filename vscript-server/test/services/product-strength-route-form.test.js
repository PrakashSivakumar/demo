const assert = require('assert');
const app = require('../../src/app');

describe('\'productStrengthRouteForm\' service', () => {
  it('registered the service', () => {
    const service = app.service('product-strength-route-form');

    assert.ok(service, 'Registered the service');
  });
});
