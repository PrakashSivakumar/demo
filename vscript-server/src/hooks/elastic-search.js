// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

function searchUsers(context) {
  return new Promise(resolve => {
    let result = context.app.service('users').Model.search({
      query_string: {
        query: context.params.query.$search
      }
    }, (err, results) => {
      if (err) console.log(err);
      resolve(results);
    });
  });
}

function searchVehicleDetails(context) {
  return new Promise(resolve => {
    let result = context.app.service('vehicle-details').Model.search({
      query_string: {
        query: context.params.query.$search
      }
    }, (err, results) => {
      if (err) console.log(err);
      resolve(results);
    });
  });
}

function searchPatients(context) {
  return new Promise(resolve => {
    let result = context.app.service('patient').Model.search({
      query_string: {
        query: context.params.query.$search
      }
    }, (err, results) => {
      if (err) console.log(err);
      resolve(results);
    });
  });
}

function searchProductNDC(context) {
  return new Promise(resolve => {
    let result = context.app.service('gsdd5-package').Model.search({
      query_string: {
        query: context.params.query.$search
      }
    }, (err, results) => {
      if (err) console.log(err);
      resolve(results);
    });
  });
}

function searchProductName(context) {
  return new Promise(resolve => {
    let result = context.app.service('gsdd5-product').Model.search({
      query_string: {
        query: context.params.query.$search
      }
    }, (err, results) => {
      if (err) console.log(err);
      resolve(results);
    });
  });
}

function searchPharmacy(context) {
  return new Promise(resolve => {
    let result = context.app.service('pharmacy').Model.search({
      query_string: {
        query: context.params.query.$search
      }
    }, (err, results) => {
      if (err) console.log(err);
      resolve(results);
    });
  });
}

function searchPrescriber(context) {
  console.log(context.params.query)
  return new Promise(resolve => {
    let result = context.app.service('prescriber').Model.search({
      query_string: {
        query: context.params.query.$search
      }
    }, (err, results) => {
      if (err) console.log(err);
      resolve(results);
    });
  });
}

function searchProduct(context) {
  console.log(context.params.query)

  return new Promise(resolve => {

    let result = context.app.service('druglist-edi').Model.search({
      query_string: {
        query: context.params.query.$search
      }
    }, (err, results) => {
      if (err) console.log(err);
      resolve(results);
    });
  });
}

function searchCheckout(context) {
  console.log(context.params.query);
  return new Promise(resolve => {
    let result = context.app.service('checkout').Model.search({
      query_string: {
        query: context.params.query.$search
      }
    }, (err, results) =>{
      if(err) console.log(err);
      resolve(results);
    });
  });
}

function searchAllergy(context) {
  console.log(context.params.query);
  return new Promise(resolve => {
    let result = context.app.service('gsdd-5-allergy').Model.search({
      query_string: {
        query: context.params.query.$search
      }
    }, (err, results) =>{
      if(err) console.log(err);
      resolve(results);
    });
  });
}

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    if (context.params.query.$search) {
      // console.log(context.params.query.$search)
      let result;
      switch (context.path) {
        case 'patient':
          result = await searchPatients(context);
          // console.log(result);
          context.result = result;
          break;
        case 'prescriber':
          result = await searchPrescriber(context);
          // console.log(result);
          context.result = result;
          break;
        case 'gsdd5-package':
          result = await searchProductNDC(context);
          // console.log(result);
          context.result = result;
          break;
        case 'gsdd5-product':
          result = await searchProductName(context);
          // console.log(result);
          context.result = result;
          break;
        case 'users':
          result = await searchUsers(context);
          context.result = result;
          break;
        case 'pharmacy':
          result = await searchPharmacy(context);
          context.result = result;
          break;
        case 'druglist-edi':
          result = await searchProduct(context);
          context.result = result;
          break;
        case 'checkout':
          result = await searchCheckout(context);
          context.result = result;
          break;
        case 'gsdd-5-allergy':
          result = await searchAllergy(context);
          context.result = result;
          break;
        case 'vehicle-details':
          result = await searchVehicleDetails(context);
          context.result = result;
          break;
        default:
          break;
      }
    }
    //
    return context;
  };
};
