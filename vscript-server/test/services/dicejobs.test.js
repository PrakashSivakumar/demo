const assert = require('assert');
const app = require('../../src/app');

describe('\'dicejobs\' service', () => {
  it('registered the service', () => {
    const service = app.service('dicejobs');

    assert.ok(service, 'Registered the service');
  });
});
