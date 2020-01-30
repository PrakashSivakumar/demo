const assert = require('assert');
const app = require('../../src/app');

describe('\'square\' service', () => {
  it('registered the service', () => {
    const service = app.service('square');

    assert.ok(service, 'Registered the service');
  });
});
