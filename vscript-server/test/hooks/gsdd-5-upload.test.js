const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const gsdd5Upload = require('../../src/hooks/gsdd-5-upload');

describe('\'gsdd5Upload\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      before: gsdd5Upload()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
