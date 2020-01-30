const assert = require('assert');
const app = require('../../src/app');

describe('\'videolastweek\' service', () => {
  it('registered the service', () => {
    const service = app.service('videolastweek');

    assert.ok(service, 'Registered the service');
  });
});
