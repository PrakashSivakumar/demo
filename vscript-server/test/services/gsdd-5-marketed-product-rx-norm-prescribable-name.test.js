const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-Marketed_Product_RxNorm_Prescribable_Name\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-marketed-product-rx-norm-prescribable-name');

    assert.ok(service, 'Registered the service');
  });
});
