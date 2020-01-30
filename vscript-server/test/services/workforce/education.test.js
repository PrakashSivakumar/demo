const assert = require('assert');
const app = require('../../../src/app');

describe('\'workforce/education\' service', () => {
  it('registered the service', () => {
    const service = app.service('workforce/education');

    assert.ok(service, 'Registered the service');
  });
});
