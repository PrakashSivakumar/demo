const assert = require('assert');
const app = require('../../src/app');

describe('\'patienthistory\' service', () => {
  it('registered the service', () => {
    const service = app.service('patienthistory');

    assert.ok(service, 'Registered the service');
  });
});
