const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-Product_Strength_Route_Form\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-product-strength-route-form');

    assert.ok(service, 'Registered the service');
  });
});
