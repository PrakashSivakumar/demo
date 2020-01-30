const assert = require('assert');
const app = require('../../src/app');

describe('\'fax\' service', () => {
  it('registered the service', () => {
    const service = app.service('fax');

    assert.ok(service, 'Registered the service');
  });
});
