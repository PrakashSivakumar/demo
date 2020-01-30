// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    console.log("dataakkks",context.data);
        if(context.data.details.mobileappstatus==='mobileapp'){

          let userid = {'_id': context.data._id}
          console.log("ssss",userid);

           elasticData = await context.app.service('users').Model.findOneAndUpdate(userid, context.data,{new: true},);
           context.result = JSON.parse(JSON.stringify(elasticData));
          return context;
    }
  };
};
