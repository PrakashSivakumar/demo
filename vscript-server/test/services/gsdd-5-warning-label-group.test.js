const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-Warning_Label_Group\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-warning-label-group');

    assert.ok(service, 'Registered the service');
  });
});
