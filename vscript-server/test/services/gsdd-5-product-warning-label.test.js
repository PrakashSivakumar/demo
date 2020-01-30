const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-Product_Warning_Label\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-product-warning-label');

    assert.ok(service, 'Registered the service');
  });
});
