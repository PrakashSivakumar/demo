const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-Sigcode\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-sigcode');

    assert.ok(service, 'Registered the service');
  });
});
