const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-Patient_Education_Int1\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-patient-education-int1');

    assert.ok(service, 'Registered the service');
  });
});
