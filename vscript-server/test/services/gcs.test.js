const assert = require('assert');
const app = require('../../src/app');

describe('\'gcs\' service', () => {
  it('registered the service', () => {
    const service = app.service('gcs');

    assert.ok(service, 'Registered the service');
  });
});
