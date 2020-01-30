const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-NondrugItem_ImageList\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-nondrug-item-image-list');

    assert.ok(service, 'Registered the service');
  });
});
