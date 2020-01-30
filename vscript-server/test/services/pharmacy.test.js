const assert = require('assert');
const app = require('../../src/app');

describe('\'pharmacy\' service', () => {
  it('registered the service', () => {
    const service = app.service('pharmacy');

    assert.ok(service, 'Registered the service');
  });
});
