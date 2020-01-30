const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const mssqlMigration = require('../../src/hooks/mssql-migration');

describe('\'mssqlMigration\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { id };
      }
    });

    app.service('dummy').hooks({
      before: mssqlMigration()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.deepEqual(result, { id: 'test' });
  });
});
