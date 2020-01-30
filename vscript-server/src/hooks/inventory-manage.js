// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {

    let total, data;
    if (context.params.query.$inventory) {
      let request = context.params.query.$inventory;

      total = await context.app.service('druglist-edi').Model.aggregate(
        [
          {
            $count: 'total_count'
          },
        ]
      );
      data = await context.app.service('druglist-edi').Model.aggregate(
        [
          {
            $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
          },
          {
            $skip: request.pageElements
          },

          {$limit: 11},
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
