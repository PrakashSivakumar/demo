const assert = require('assert');
const app = require('../../../src/app');

describe('\'workforce/skills\' service', () => {
  it('registered the service', () => {
    const service = app.service('workforce/skills');

    assert.ok(service, 'Registered the service');
  });
});
