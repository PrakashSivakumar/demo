const assert = require('assert');
const app = require('../../src/app');

describe('\'prescriber\' service', () => {
  it('registered the service', () => {
    const service = app.service('prescriber');

    assert.ok(service, 'Registered the service');
  });
});
