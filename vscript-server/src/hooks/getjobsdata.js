// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    if (context.params.query.$Jobs) {
      let request = context.params.query.$Jobs;
      let total = await context.app.service('dicejobs').Model.aggregate(
        [
          {
            $count: 'total_count'
          }
        ]
      );
      let data = await context.app.service('dicejobs').Model.aggregate(
        [
          {
            $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
          },
          {
            $skip: request.pageElements
          },
          {$limit: 20},
        ]
      );
      context.result = {
        total: total[0] === undefined ? 0 : total[0].total_count,
        data: data
      };
    }
    return context;
  };
};
