const assert = require('assert');
const app = require('../../../src/app');

describe('\'workforce/placements\' service', () => {
  it('registered the service', () => {
    const service = app.service('workforce/placements');

    assert.ok(service, 'Registered the service');
  });
});
