const assert = require('assert');
const app = require('../../src/app');

describe('\'patient-counselling\' service', () => {
  it('registered the service', () => {
    const service = app.service('patient-counselling');

    assert.ok(service, 'Registered the service');
  });
});
