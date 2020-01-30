const assert = require('assert');
const app = require('../../src/app');

describe('\'timeSheets\' service', () => {
  it('registered the service', () => {
    const service = app.service('time-sheets');

    assert.ok(service, 'Registered the service');
  });
});
