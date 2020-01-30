// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    let elasticData;
    switch (context.path) {
      case 'patient':
        console.log('patientData', context.data);
        let paientid = {'_id': context.id}
        elasticData = await context.app.service('patient').Model.findOneAndUpdate(paientid, context.data.query.patientDetails, {new: true},);
        context.result = {elasticData: elasticData, params: context.data.query, hippaParams: context.params}
        return context;
        break;
      case 'prescriber':
        let prescriberid = {'_id': context.id}
        elasticData = await context.app.service('prescriber').Model.findOneAndUpdate(prescriberid, context.data.query.prescriberDetails, {new: true},);
        context.result = {elasticData: elasticData, params: context.data.query}
        return context;
        break;
      case 'users':
        if (context.method === 'remove') {
          let userid = {'_id': context.id}
          elasticData = await context.app.service('users').Model.findOneAndRemove(userid);
          context.result = JSON.parse(JSON.stringify(elasticData));
          return context;
        } else {
          let userid = {'_id': context.id}
          elasticData = await context.app.service('users').Model.findOneAndUpdate(userid, context.data, {new: true},);
          context.result = JSON.parse(JSON.stringify(elasticData));
          return context;
        }
        break;
      case 'rx':
        if(context.method === 'patch' && context.data.notification === 'TransferOut') {
          let userid = {'_id': context.id}
          elasticData = await context.app.service('rx').Model.findOneAndUpdate(userid, context.data);
          context.result = JSON.parse(JSON.stringify(elasticData));
          return context;
        }
        break;
    }
  };
};
