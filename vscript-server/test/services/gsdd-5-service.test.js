const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5Service\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-service');

    assert.ok(service, 'Registered the service');
  });
});
