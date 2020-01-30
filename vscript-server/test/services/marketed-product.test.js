const assert = require('assert');
const app = require('../../src/app');

describe('\'marketedProduct\' service', () => {
  it('registered the service', () => {
    const service = app.service('marketed-product');

    assert.ok(service, 'Registered the service');
  });
});
