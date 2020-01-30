const assert = require('assert');
const app = require('../../src/app');

describe('\'tasklist\' service', () => {
  it('registered the service', () => {
    const service = app.service('tasklist');

    assert.ok(service, 'Registered the service');
  });
});
