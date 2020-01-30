const assert = require('assert');
const app = require('../../src/app');

describe('\'pharmacyList\' service', () => {
  it('registered the service', () => {
    const service = app.service('pharmacy-list');

    assert.ok(service, 'Registered the service');
  });
});
