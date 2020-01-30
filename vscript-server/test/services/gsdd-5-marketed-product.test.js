const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-Marketed_Product\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-marketed-product');

    assert.ok(service, 'Registered the service');
  });
});
