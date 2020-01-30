const assert = require('assert');
const app = require('../../src/app');

describe('\'price\' service', () => {
  it('registered the service', () => {
    const service = app.service('price');

    assert.ok(service, 'Registered the service');
  });
});
