const feathers = require('@feathersjs/feathers');
function rxControls(context){
  return new Promise((resolve,reject) => {
    console.log(context.method);

    object = {
      accessControls : context.params.connection.payload.accessControls
    };

    console.log('accessControls', object.accessControls);

    if(object.accessControls.includes(context.method)){
      console.log('there');
      resolve('done');
    } else {
      context.error = new Error('UnAuthorized');
      reject(context.error);
    }
    return context;
  });
}


module.exports = function(options = {}){
  return async context => {
    if(context.path !== 'users' && context.path !== 'authentication') {
      try {
        let result  = await rxControls(context);

        console.log('result: ', result);

      } catch (e) {
        console.log('errors: ', e);
        context.result = 'Unauthorized';
        return feathers.SKIP;
      }
    }
    // context.result = result;

    return context;
  };
};
