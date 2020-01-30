// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
let atob = require('atob');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {

    // if (context.params.headers && context.params.headers.host) {
    //   if (((atob(((context.arguments[1].headers.authorization).split(' '))[1])).split(':'))[0] === '$u73scr8vs') {
    //     let details = {
    //       "strategy": "local",
    //       "username": ((atob(((context.arguments[1].headers.authorization).split(' '))[1])).split(':'))[0],
    //       "password": ((atob(((context.arguments[1].headers.authorization).split(' '))[1])).split(':'))[1]
    //     };
    //     let {accessToken} = await context.app.service('authentication').create(details);
    //     console.log('token', accessToken);
    //     context.params.headers.authorization = accessToken;
    //   }
    // }


    if (context.params.headers && context.params.headers.host) {
      let details = {
        "strategy": "local",
        "username": '$u73scr8vs',
        "password": 'ZrhKlaq9vgQX5'
      };
      let {accessToken} = await context.app.service('authentication').create(details);
      console.log('token', accessToken);
      context.params.headers.authorization = accessToken;
    }
    return context;
  };
};
