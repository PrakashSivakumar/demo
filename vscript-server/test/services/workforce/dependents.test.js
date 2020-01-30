const assert = require('assert');
const app = require('../../../src/app');

describe('\'workforce/dependents\' service', () => {
  it('registered the service', () => {
    const service = app.service('workforce/dependents');

    assert.ok(service, 'Registered the service');
  });
});
