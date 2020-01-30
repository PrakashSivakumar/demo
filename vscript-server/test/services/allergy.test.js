const assert = require('assert');
const app = require('../../src/app');

describe('\'allergy\' service', () => {
  it('registered the service', () => {
    const service = app.service('allergy');

    assert.ok(service, 'Registered the service');
  });
});
