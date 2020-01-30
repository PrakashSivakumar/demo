const assert = require('assert');
const app = require('../../src/app');

describe('\'ownerReport\' service', () => {
  it('registered the service', () => {
    const service = app.service('owner-report');

    assert.ok(service, 'Registered the service');
  });
});
