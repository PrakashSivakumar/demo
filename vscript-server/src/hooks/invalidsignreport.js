// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    if (context.params.query.invalidsignReport) {
      let request = context.params.query.invalidsignReport;
      console.log('request', request);
      total = await context.app.service('invalidsign').Model.aggregate([
        {
          $count: 'total_count'
        }
      ]);
      data = await context.app.service('invalidsign').Model.aggregate([
        {
          $sort: {[request.columnName]: Number(request.direction + 1)},
        },
        {
          $skip: request.pageElements
        },
        {$limit: context.app.get('paginate').default}
      ]);
      context.result = {
        total: total[0] === undefined ? 0 : total[0].total_count,
        data: data
      };
    }
    return context;
  };
};
