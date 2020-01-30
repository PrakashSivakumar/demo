// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    console.log('last-fill',context.result['data'].slice(-1)[0]); //.refills.fills.slice(-1))
     // context.result = context.result['data'].slice(-1)[0];
    // console.log(context.result.slice(-1)[0]);
    return context;
  };
};
