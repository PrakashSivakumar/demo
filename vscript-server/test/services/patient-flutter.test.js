const assert = require('assert');
const app = require('../../src/app');

describe('\'patient-flutter\' service', () => {
  it('registered the service', () => {
    const service = app.service('patient-flutter');

    assert.ok(service, 'Registered the service');
  });
});
