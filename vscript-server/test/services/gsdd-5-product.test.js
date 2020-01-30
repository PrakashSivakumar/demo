const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-product\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-product');

    assert.ok(service, 'Registered the service');
  });
});
