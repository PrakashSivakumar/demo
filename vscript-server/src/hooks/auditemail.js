// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const nodemailer = require('nodemailer');
const cron = require('node-cron');


module.exports = function (options = {}) {
  return async context => {
    let request = context.params.query.$dashboard;
    let routeName = request.routeName;
    let total, data
    switch (routeName) {
      case'mongoLogs' :
        if (request.fromDate === '' || request.toDate === '') {
          let todayincome = new Date(), beforeincome = Date.parse(todayincome.getDate() - 1);
          total = await context.app.service('audit').Model.aggregate(
            [

              {
                $count: 'total_count'
              },

            ]
          );
          data = await context.app.service('audit').Model.aggregate(
            [
              {
                $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
              },
              {
                $skip: request.pageElements
              },
              {$limit: 100}
            ]
          );
          context.result = {
            total: total[0] === undefined ? 0 : total[0].total_count,
            data: data
          };
        }
        else {
          console.log('todate and fromdate ',new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 2),
            new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate()));
          total = await context.app.service('audit').Model.aggregate(
            [
              {
                $match: {
                  'ts': {
                    $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
                    $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate())
                  }
                }
              },
              {
                $count: 'total_count'
              },
            ]
          );
          data = await context.app.service('audit').Model.aggregate(
            [
              {
                $match: {
                  'ts': {
                    $lte: new Date(new Date(request.toDate).getFullYear(), new Date(request.toDate).getMonth(), new Date(request.toDate).getDate() + 1),
                    $gte: new Date(new Date(request.fromDate).getFullYear(), new Date(request.fromDate).getMonth(), new Date(request.fromDate).getDate())
                  }
                }
              },
              {
                $sort: {[request.sortColumnName]: Number(request.sortDirection + '1')},
              },
              {
                $skip: request.pageElements
              },
              {$limit: 100}
              // {$limit: context.app.get('paginate').default}
            ]
          );
          context.result = {
            total: total[0] === undefined ? 0 : total[0].total_count,
            data: data
          };
        }
        break;
    }

    return context;
  };
};







