const assert = require('assert');
const app = require('../../src/app');

describe('\'addEmployee\' service', () => {
  it('registered the service', () => {
    const service = app.service('add-employee');

    assert.ok(service, 'Registered the service');
  });
});
