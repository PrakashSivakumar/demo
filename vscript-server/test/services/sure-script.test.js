const assert = require('assert');
const app = require('../../src/app');

describe('\'sureScript\' service', () => {
  it('registered the service', () => {
    const service = app.service('sure-script');

    assert.ok(service, 'Registered the service');
  });
});
