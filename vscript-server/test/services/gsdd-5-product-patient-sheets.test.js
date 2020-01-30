const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-Product_Patient_Sheets\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-product-patient-sheets');

    assert.ok(service, 'Registered the service');
  });
});
