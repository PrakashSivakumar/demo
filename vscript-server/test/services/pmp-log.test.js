const assert = require('assert');
const app = require('../../src/app');

describe('\'pmpLog\' service', () => {
  it('registered the service', () => {
    const service = app.service('pmp-log');

    assert.ok(service, 'Registered the service');
  });
});
