const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-Product_Adverse_Reaction\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-product-adverse-reaction');

    assert.ok(service, 'Registered the service');
  });
});
