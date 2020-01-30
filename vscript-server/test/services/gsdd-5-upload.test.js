const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5Upload\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-upload');

    assert.ok(service, 'Registered the service');
  });
});
