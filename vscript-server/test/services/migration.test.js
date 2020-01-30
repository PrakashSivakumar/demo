const assert = require('assert');
const app = require('../../src/app');

describe('\'migration\' service', () => {
  it('registered the service', () => {
    const service = app.service('migration');

    assert.ok(service, 'Registered the service');
  });
});
