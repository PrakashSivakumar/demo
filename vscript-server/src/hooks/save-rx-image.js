// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// const shortid = require('shortid');
var mongoose = require('mongoose');

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const id = context.data.id ? context.data.id : mongoose.Types.ObjectId();

    if (!context.data.id) {
      context.data._id = id;
    }
    if ((context.path === 'pharmacy' && context.method === 'create') || (context.path === 'pharmacy' && context.method === 'patch')) {
      let pharmacyLogo = new Promise((resolve, reject) => {
        if (context.data.details.logo && !context.data.details.logo.includes('https://')) {
          context.app.service('gcs').create({
            uri: context.data.details.logo
          }, {
            query: {
              name: id + '-image'
            }
          }).then(result => {
            context.data.details.logo = result.url;
            resolve(true);
          }).catch(error => reject(error));
        } else {
          resolve(true);
        }
      });
      let image = await pharmacyLogo;
    } else {
      let prescriptionImage = new Promise((resolve, reject) => {
        if (context.data.image && !context.data.image.includes('https://')) {

          context.app.service('gcs').create({
              uri: context.data.image
            },
            {
              query: {
                name: id + new Date().getTime() + '-image'
              }
            }).then(result => {
            context.data.image = result.url;
            resolve(true);
          }).catch(error => reject(error));
        } else {
          resolve(true);
        }

      });
      let image = await prescriptionImage;
      if (context.data.refills) {
        for (const [index, value] of context.data.refills.fills.entries()) {
          if (value.rxImage && value.rxImage.drug && !value.rxImage.drug.includes('https://')) {
            let drugImage = new Promise(resolve => {
              context.app.service('gcs').create({
                uri: value.rxImage.drug
              }, {
                query: {
                  name: id + index + new Date().getTime() + '-drug'
                }
              }).then(result => {
                context.data.refills.fills[index].rxImage.drug = result.url;
                resolve(true);
              }).catch(err => reject(err));
            });
            await drugImage;
          }
          if (value.rxImage && value.rxImage.label && !value.rxImage.label.includes('https://')) {
            let labelImage = new Promise(resolve => {

              context.app.service('gcs').create({
                uri: value.rxImage.label
              }, {
                query: {
                  name: id + new Date().getTime() + index + '-label'
                }
              }).then(result => {
                context.data.refills.fills[index].rxImage.label = result.url;
                console.log(result.url)
                resolve(true);
              }).catch(err => reject(err));

            });
            await labelImage;
          }
          if (value.rxImage && value.rxImage.optional && !value.rxImage.optional.includes('https://')) {
            let optionalImage = new Promise((resolve, reject) => {

              context.app.service('gcs').create({
                uri: value.rxImage.optional
              }, {
                query: {
                  name: id + index + new Date().getTime() + '-optional'
                }
              }).then(result => {
                context.data.refills.fills[index].rxImage.optional = result.url;
                resolve(true);
              }).catch(err => reject(err));

            });
            await optionalImage;
          }
        }
      }
    }
    return context;
  };
};
