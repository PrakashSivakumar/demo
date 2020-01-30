const assert = require('assert');
const app = require('../../src/app');

describe('\'vscriptUsers\' service', () => {
  it('registered the service', () => {
    const service = app.service('vscript-users');

    assert.ok(service, 'Registered the service');
  });
});
