// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

function adversreaction(context) {
  return new Promise(resolve => {
    console.log(context.params.query.NDC11)
    context.app.service('gsdd5-product-adverse-reaction').Model.aggregate(
      [

        {
          $lookup: {
            'localField': 'gsdd5productadversereactions.GSTermID',
            'from': 'gsdd5gsterms',
            'foreignField': 'GSTermId',
            'as': 'gsdd5gsterms'
          }
        },
        {
          $lookup: {
            'localField': 'gsdd5productadversereactions.GSTermID',
            'from': 'gsdd5gstermicd10',
            'foreignField': 'GSTermId',
            'as': 'gsdd5gstermicd10'
          }
        },

        {
          $lookup: {
            'localField': 'gsdd5productadversereactions.ProductID',
            'from': 'gsdd5products',
            'foreignField': 'ProductID',
            'as': 'gsdd5products'
          }
        },

        {
          $lookup: {
            'localField': 'gsdd5products.ProductID',
            'from': 'gsdd5packages',
            'foreignField': 'ProductID',
            'as': 'gsdd5packages'
          }
        },

        {
          $match: {
            'gsdd5packages.NDC11': Number(context.params.query.NDC11)
          }
        }
      ]
    ).then(result => {
      resolve(result);
    })
      .catch(err => console.log(err));
  });
}


module.exports = function (options = {}) {
  return async context => {
    // console.log(context.params.query.NDC11);

    let result = await adversreaction(context);
    context.result = result;

    return context;
  };
};
