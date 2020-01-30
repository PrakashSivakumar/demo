const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const hl7Parser = require('../../src/hooks/hl-7-parser');

describe('\'hl7Parser\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      before: hl7Parser()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
