const assert = require('assert');
const app = require('../../src/app');

describe('\'videothisweek\' service', () => {
  it('registered the service', () => {
    const service = app.service('videothisweek');

    assert.ok(service, 'Registered the service');
  });
});
