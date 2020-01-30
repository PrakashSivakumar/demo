// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function () { // eslint-disable-line no-unused-vars
  return async context => {
    let request = context.params.query.$dashboard;
    let total = await context.app.service('loginlogs').Model.aggregate(
      [
        {
          $count: 'total_count'
        }
      ]
    );
    let data = await context.app.service('loginlogs').Model.aggregate(
      [
        {
          $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
        },
        {
          $skip: request.pageElements
        },
        {$limit: context.app.get('paginate').default},
      ]
    );
    context.result = {
      total: total[0] === undefined ? 0 : total[0].total_count,
      data: data
    };
    return context;
  };
};
