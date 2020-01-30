const assert = require('assert');
const app = require('../../src/app');

describe('\'insurencePending\' service', () => {
  it('registered the service', () => {
    const service = app.service('insurence-pending');

    assert.ok(service, 'Registered the service');
  });
});
