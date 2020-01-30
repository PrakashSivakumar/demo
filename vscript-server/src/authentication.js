const authentication = require('@feathersjs/authentication');
const jwt = require('@feathersjs/authentication-jwt');
const local = require('@feathersjs/authentication-local');


module.exports = function (app) {
  const config = app.get('authentication');

  // Set up authentication with the secret
  app.configure(authentication(config));
  app.configure(jwt());
  app.configure(local());

  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  app.service('authentication').hooks({
    before: {
      create: [
        authentication.hooks.authenticate(config.strategies),
        // This hook adds the `test` attribute to the JWT payload by
        // modifying params.payload.
        context => {
          // make sure params.payload exists
          context.params.payload = context.params.payload || {};
          // merge in a `test` property
          // console.log(context.params.headers['user-agent'])
          app.service('users').get(context.params.payload.userId).then(result => {

            if (result.stats.isActive) {
              Object.assign(context.params.payload, {roles: result.roles, accessControls: result.accessControls});
              return context;
            } else {
              // Object.assign(context.params.payload, {accessControls:'denied'});
              context.result = {accessControls: 'denied'};
              delete context.data;
              delete context.params;
              // console.log({context});
              return context;
            }
          }).catch(error => {
            console.log('err', error);
          });
        }
      ],
      remove: [
        authentication.hooks.authenticate('jwt')
      ]
    }
  });
};
