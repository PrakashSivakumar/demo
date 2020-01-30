const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-GSTerms\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-gs-terms');

    assert.ok(service, 'Registered the service');
  });
});
