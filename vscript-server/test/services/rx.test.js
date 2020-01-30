const assert = require('assert');
const app = require('../../src/app');

describe('\'rx\' service', () => {
  it('registered the service', () => {
    const service = app.service('rx');

    assert.ok(service, 'Registered the service');
  });
});
