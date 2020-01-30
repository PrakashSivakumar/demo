const assert = require('assert');
const app = require('../../src/app');

describe('\'gssd5-Federal\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-federal');

    assert.ok(service, 'Registered the service');
  });
});
