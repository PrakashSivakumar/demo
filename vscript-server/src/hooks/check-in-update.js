// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const mongoose = require('mongoose');
const Types = mongoose.Types,
  ObjectId = Types.ObjectId;
module.exports = function (options = {}) {
  return async context => {

    return context;
  };
};


// module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
//   return function checkInUpdate (hook) {
//     // Hooks can either return nothing or a promise
//     // that resolves with the `hook` object for asynchronous operations
//     return Promise.resolve(hook);
//   };
// };
