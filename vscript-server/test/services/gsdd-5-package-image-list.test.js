const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-package-image-list\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-package-image-list');

    assert.ok(service, 'Registered the service');
  });
});
