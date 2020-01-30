const assert = require('assert');
const app = require('../../src/app');

describe('\'audit-logs\' service', () => {
  it('registered the service', () => {
    const service = app.service('audit-logs');

    assert.ok(service, 'Registered the service');
  });
});
