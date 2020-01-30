const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-GSTerm_ICD10\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-gs-term-icd10');

    assert.ok(service, 'Registered the service');
  });
});
