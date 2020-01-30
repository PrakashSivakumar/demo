// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const query = context.params.query;
    if(query.$search) {
      const field = Object.keys(query.$search)[0];
      query[field] = { $regex: new RegExp(query.$search[field]) };
    }
    delete query.$search;
    // console.log(query);
    context.params.query = query;
    return context;
  };
};
