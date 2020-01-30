const assert = require('assert');
const app = require('../../../src/app');

describe('\'workforce/contact\' service', () => {
  it('registered the service', () => {
    const service = app.service('workforce/contact');

    assert.ok(service, 'Registered the service');
  });
});
