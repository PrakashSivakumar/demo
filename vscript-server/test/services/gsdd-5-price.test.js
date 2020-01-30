const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-Price\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-price');

    assert.ok(service, 'Registered the service');
  });
});
