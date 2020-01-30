const assert = require('assert');
const app = require('../../src/app');

describe('\'invgenerator\' service', () => {
  it('registered the service', () => {
    const service = app.service('invgenerator');

    assert.ok(service, 'Registered the service');
  });
});
