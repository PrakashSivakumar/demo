const assert = require('assert');
const app = require('../../src/app');

describe('\'claimLog\' service', () => {
  it('registered the service', () => {
    const service = app.service('claim-log');

    assert.ok(service, 'Registered the service');
  });
});
