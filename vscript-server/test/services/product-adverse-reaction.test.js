const assert = require('assert');
const app = require('../../src/app');

describe('\'productAdverseReaction\' service', () => {
  it('registered the service', () => {
    const service = app.service('product-adverse-reaction');

    assert.ok(service, 'Registered the service');
  });
});
