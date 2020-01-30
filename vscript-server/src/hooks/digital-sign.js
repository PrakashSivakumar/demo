// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const crypto = require('crypto');

module.exports = function (options = {}) {
  return async context => {
      try {
        const hash = crypto.createHmac('sha256', context.app.settings.digitalSignKey)
          .update(context.data.rxId + '' + context.data.prescriber.npi)
          .digest('hex');
        context.data.digitalSignature.push(hash);
      } catch (err) {
      }
    return context;
  };
};
