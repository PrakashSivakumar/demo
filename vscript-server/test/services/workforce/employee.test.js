const assert = require('assert');
const app = require('../../../src/app');

describe('\'workforce/employee\' service', () => {
  it('registered the service', () => {
    const service = app.service('workforce/employee');

    assert.ok(service, 'Registered the service');
  });
});
