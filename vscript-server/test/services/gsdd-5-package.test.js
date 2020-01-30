const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-package\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-package');

    assert.ok(service, 'Registered the service');
  });
});
