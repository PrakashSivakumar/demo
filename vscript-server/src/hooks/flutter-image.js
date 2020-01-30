// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {

    let image = new Promise((resolve, reject)=>{
      if (context.data.scannedImage) {
        context.app.service('gcs').create({
          uri: context.data.scannedImage
        }, {
          query: {
            name: 'image'
          }
        }).then(result => {
          context.data.scannedImage = result.url;
          resolve(true);
        }).catch(error => reject(error));
      }
      else {
        resolve(true);
      }
    });
    return context;
  };
};
