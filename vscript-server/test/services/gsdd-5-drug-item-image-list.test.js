const assert = require('assert');
const app = require('../../src/app');

describe('\'gsdd5-DrugItem_ImageList\' service', () => {
  it('registered the service', () => {
    const service = app.service('gsdd5-drug-item-image-list');

    assert.ok(service, 'Registered the service');
  });
});
