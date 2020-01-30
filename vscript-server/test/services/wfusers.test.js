const assert = require('assert');
const app = require('../../src/app');

describe('\'wfusers\' service', () => {
  it('registered the service', () => {
    const service = app.service('wfusers');

    assert.ok(service, 'Registered the service');
  });
});
