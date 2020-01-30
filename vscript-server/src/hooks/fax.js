// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html


module.exports = function (options = {}) {
  return async context => {
    console.log('faxData', context.data);

    function faxRequest() {
      return new Promise((resolve, reject) => {
        const accountSid = 'AC4b10661d21be51d7752ddc299ded3ae8';
        const authToken = 'dc87e7ae4f8631d75f98adf0d1416700';
        const client = require('twilio')(accountSid, authToken);
        client.fax.faxes
          .create({
            from: '+15017122661',
            to: '+15558675310',
            mediaUrl: 'https://www.twilio.com/docs/documents/25/justthefaxmaam.pdf'
          })
          .then(fax => {
            resolve(fax.sid);
          }).catch(err => reject(err))
          .done();
      });
    }

    let faxRequestString = await faxRequest();
    return context;
  };
};
