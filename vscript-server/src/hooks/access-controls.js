
const feathers = require('@feathersjs/feathers');


function accessControls(context){
  return new Promise((resolve,reject) => {
    object = {
      role: context.params.connection.payload.roles[0],
      path: context.path,
    };
    context.app.service('accesscontrol').Model.find(object).then(data=>{
      if(data.length > 0 && data[0].method.includes(context.method)){
        // console.log('there');
        resolve('done');
      } else {
        context.error = new Error('UnAuthorized');
        reject(context.error);
      }
    }).catch(err=>{
      reject(err);
    });
    return context;
  });
}


module.exports = function(options = {}){
  return async context => {
    if(context.path !== 'users' && context.path !== 'authentication') {
      try {
        let result  = await accessControls(context);

        // console.log('result: ', result);

      } catch (e) {
        // console.log('errors: ', e);
        context.result = 'Unauthorized';
        return feathers.SKIP;
      }
    }
    // context.result = result;

    return context;
  };
};

