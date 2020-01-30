const assert = require('assert');
const app = require('../../src/app');

describe('\'vectorsoftmail\' service', () => {
  it('registered the service', () => {
    const service = app.service('vectorsoftmail');

    assert.ok(service, 'Registered the service');
  });
});
