const assert = require('assert');
const app = require('../../src/app');

describe('\'claim\' service', () => {
  it('registered the service', () => {
    const service = app.service('claim');

    assert.ok(service, 'Registered the service');
  });
});
