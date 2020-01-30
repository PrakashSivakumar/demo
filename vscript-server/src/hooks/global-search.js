// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const elasticsearch = require('elasticsearch');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const client = new elasticsearch.Client({
      host: context.app.get('elasticSearch'),
      log: 'trace'
    });
    console.log(context.params.query.$search);
    if (context.params.query.index === 'controlled') {
      const response = await client.search({
        index: ['patients', 'prescribers', 'rxs'],
        q: context.params.query.$search + '*',
      });
      context.result = response;
    } else {
      if (!context.params.query.index.includes('rxs')) {
        const response = await client.search({
          index: context.params.query.index,
          q: context.params.query.$search + '*',
        });
        context.result = response;
      } else {
        const response = await client.search({
          index: context.params.query.index,
          q: context.params.query.$search,
        });
        context.result = response;
      }
    }
  }
  return context;
};
