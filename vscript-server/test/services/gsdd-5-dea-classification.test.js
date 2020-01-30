const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-DEA_Classification\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-dea-classification');

    assert.ok(service, 'Registered the service');
  });
});
