const assert = require('assert');
const app = require('../../src/app');

describe('\'videocollab\' service', () => {
  it('registered the service', () => {
    const service = app.service('videocollab');

    assert.ok(service, 'Registered the service');
  });
});
