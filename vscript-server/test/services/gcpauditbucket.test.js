const assert = require('assert');
const app = require('../../src/app');

describe('\'gcpauditbucket\' service', () => {
  it('registered the service', () => {
    const service = app.service('gcpauditbucket');

    assert.ok(service, 'Registered the service');
  });
});
