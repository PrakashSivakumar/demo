const assert = require('assert');
const app = require('../../src/app');

describe('\'samplemail\' service', () => {
  it('registered the service', () => {
    const service = app.service('samplemail');

    assert.ok(service, 'Registered the service');
  });
});
