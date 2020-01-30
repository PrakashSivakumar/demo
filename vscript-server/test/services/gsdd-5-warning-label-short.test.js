const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-Warning_Label_Short\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd-warning-label-short');

    assert.ok(service, 'Registered the service');
  });
});
