// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

const fs = require('fs');
// const XmlStream = require('xml-stream');
//

function startUpload(context) {
  return new Promise(resolve => {
  //   let files = fs.readdirSync('public/gsdd5/');
  //   let stream;
  //   let xml;
  //   let endElement;
  //   let i = 0;
  //   files.forEach(file => {
  //     stream = fs.createReadStream('public/gsdd5/' + file);
  //     xml = new XmlStream(stream);
  //     endElement = file.substring(0, file.indexOf('.'));
  //     xml.on('endElement: ' + endElement, function (item) {
  //       i += 1;
  //       for (let obj in item) {
  //         if (item.hasOwnProperty(obj)) {
  //           item[obj] = item[obj] === 'False' ? false : item[obj] === 'True' ? true : item[obj];
  //         }
  //       }
  //       switch (file) {
  //
  //         // case 'Allergy_Class.xml':
  //         //   console.log('true allergy');
  //         //   context.app.service('gsdd-5-allergy').Model.create(item).then(() => {
  //         //     console.log('err in if');
  //         //   }).catch(error => console.log('item not found',error));
  //         //   break;
  //         // case 'Product_Patient_Sheets.xml':
  //         //   context.app.service('gsdd5-product-patient-sheets').Model.create(item).then(() => {
  //         //   }).catch(error => console.log(error));
  //         //   break;
  //         // case 'NondrugItemImage.xml':
  //         //   context.app.service('gsdd5-nondrug-item-image-list').Model.create(item).then(() => {
  //         //   }).catch(error => console.log(error));
  //         //   break;
  //         // case 'PackageImage.xml':
  //         //   context.app.service('gsdd5-package-image-list').Model.create(item).then(() => {
  //         //   }).catch(error => console.log(error));
  //         //   break;
  //         // case 'DEA_Classification.xml':
  //         //   context.app.service('gsdd5-dea-classification').Model.create(item).then(() => {
  //         //   }).catch(error => console.log(error));
  //         //   break;
  //         case 'Federal.xml':
  //           context.app.service('gsdd5-federal').Model.create(item).then(() => {
  //           }).catch(error => console.log(error));
  //           break;
  //         // case 'GSTerm_ICD10.xml':
  //         //   context.app.service('gsdd5-gs-term-icd10').Model.create(item).then(() => {
  //         //   }).catch(error => console.log(error));
  //         //   break;
  //         // case 'GSTerms.xml':
  //         //   context.app.service('gsdd5-gs-terms').Model.create(item).then(() => {
  //         //   }).catch(error => console.log(error));
  //         //   break;
  //         // case 'Marketed_Product.xml':
  //         //   context.app.service('gsdd5-marketed-product').Model.create(item).then(() => {
  //         //   }).catch(error => console.log(error));
  //         //   break;
  //         // case 'Marketed_Product_RxNorm_Prescribable_Name.xml':
  //         //   context.app.service('gsdd5-marketed-product-rx-norm-prescribable-name').Model.create(item).then(() => {
  //         //   }).catch(error => console.log(error));
  //         //   break;
  //         // case 'Product.xml':
  //         //   context.app.service('gsdd5-product').Model.create(item).then(() => {
  //         //   }).catch(error => console.log(error));
  //         //   break;
  //         // case 'Package.xml':
  //         //   context.app.service('gsdd5-package').Model.create(item).then(() => {
  //         //   }).catch(error => console.log(error));
  //         //   break;
  //         // case 'Price.xml':
  //         //   context.app.service('gsdd5-price').Model.create(item).then(() => {
  //         //   }).catch(error => console.log(error));
  //         //   break;
  //         // case 'Product_Adverse_Reaction.xml':
  //         //   context.app.service('gsdd5-product-adverse-reaction').Model.create(item).then(() => {
  //         //   }).catch(error => console.log(error));
  //         //   break;
  //         // case 'Patient_Education_Intl.xml':
  //         //   context.app.service('gsdd5-patient-education-int1').Model.create(item).then(() => {
  //         //   }).catch(error => console.log(error));
  //         //   break;
  //         // case 'Product_Strength_Route_Form.xml':
  //         //   context.app.service('gsdd5-product-strength-route-form').Model.create(item).then(() => {
  //         //   }).catch(error => console.log(error));
  //         //   break;
  //         // case 'Product_Warning_Label.xml':
  //         //   context.app.service('gsdd5-product-warning-label').Model.create(item).then(() => {
  //         //   }).catch(error => console.log(error));
  //         //   break;
  //         // case 'Warning_Label_Short.xml':
  //         //   context.app.service('gsdd-warning-label-short').Model.create(item).then(() => {
  //         //   }).catch(error => console.log(error));
  //         //   break;
  //         // case 'Warning_Label_Group.xml':
  //         //   context.app.service('gsdd5-warning-label-group').Model.create(item).then(() => {
  //         //   }).catch(error => console.log(error));
  //         //   break;
  //       }
  //     });
  //     xml.on('end', () => {
  //       console.log('done');
  //     });
  //   });
  //  resolve(schemas);
  });
}

// eslint-disable-next-line no-unused-lets
module.exports = function (options = {}) {
  return async context => {
    // context.result = await startUpload(context);
    // startUpload(context);
    // context.result = 'Upload Started!';
    return context;
  };
};
