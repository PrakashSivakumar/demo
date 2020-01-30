const assert = require('assert');
const app = require('../../src/app');

describe('\'auditemail\' service', () => {
  it('registered the service', () => {
    const service = app.service('auditemail');

    assert.ok(service, 'Registered the service');
  });
});
