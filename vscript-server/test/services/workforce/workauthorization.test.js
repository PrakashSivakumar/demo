const assert = require('assert');
const app = require('../../../src/app');

describe('\'workforce/workauthorization\' service', () => {
  it('registered the service', () => {
    const service = app.service('workforce/workauthorization');

    assert.ok(service, 'Registered the service');
  });
});
