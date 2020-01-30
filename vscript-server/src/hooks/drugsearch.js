// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

function findNdc11(context) {
  return new Promise(resolve => {
    switch (context.params.query.type) {
      case 'name':
        context.app.service('gsdd5-package').Model.aggregate([
          {
            $lookup: {
              'localField': 'ProductID',
              'from': 'gsdd5products',
              'foreignField': 'ProductID',
              'as': 'gsdd5products'
            }
          },
          {
            $lookup: {
              'localField': 'PackageID',
              'from': 'gsdd5prices',
              'foreignField': 'PackageID',
              'as': 'gsdd5prices'
            }
          },
          {
            $addFields: {
              'gsdd5prices': {
                '$filter': {
                  'input': '$gsdd5prices',
                  'as': 'gsdd5prices',
                  'cond': {
                    '$eq': ['$$gsdd5prices.PriceTypeID', 2],
                  },

                },
              }
            },
          },
          {
            $lookup: {
              'localField': 'ProductID',
              'from': 'gsdd5productstrengthrouteforms',
              'foreignField': 'ProductID',
              'as': 'gsdd5ProductStrengthRouteForm'
            }
          },
          {
            $lookup: {
              'localField': 'NDC11',
              'from': 'gssd5federals',
              'foreignField': 'NDC11',
              'as': 'gsdd5Federals'
            }
          },
          {
            $lookup: {
              'localField': 'gsdd5Federals.DEAClassificationID',
              'from': 'gsdd5deaclassifications',
              'foreignField': 'DEAClassificationID',
              'as': 'gsdd5DEAClassification'
            }
          },
          {
            $lookup: {
              'localField': 'gsdd5products.MarketedProductID',
              'from': 'gsdd5marketedproductrxnormprescribablenames',
              'foreignField': 'MarketedProductID',
              'as': 'gsdd5MarketedProduct'
            }
          },
          {
            $match: {
              'gsdd5products.ProductNameLong': {
                '$regex': new RegExp('^' + context.params.query.NDC11.toLowerCase(), 'i')
              },
            }
          }

        ]).then(result => {
          //console.log(result);
          resolve(result);
        }).catch(err => console.log(err));
        break;
      case 'ndc':
        context.app.service('gsdd5-package').Model.aggregate(
          [
            {
              $match: {
                NDC11: Number(context.params.query.NDC11)
              }
            },
            {
              $lookup: {
                'localField': 'ProductID',
                'from': 'gsdd5products',
                'foreignField': 'ProductID',
                'as': 'gsdd5Product'
              }
            },
            {
              $lookup: {
                'localField': 'PackageID',
                'from': 'gsdd5prices',
                'foreignField': 'PackageID',
                'as': 'gsdd5prices'
              }
            },
            {
              $addFields: {
                'gsdd5prices': {
                  '$filter': {
                    'input': '$gsdd5prices',
                    'as': 'gsdd5prices',
                    'cond': {
                      '$eq': ['$$gsdd5prices.PriceTypeID', 2],
                    },

                  },
                }
              },
            },
            {
              $lookup: {
                'localField': 'ProductID',
                'from': 'gsdd5productstrengthrouteforms',
                'foreignField': 'ProductID',
                'as': 'gsdd5ProductStrengthRouteForm'
              }
            },
            {
              $lookup: {
                'localField': 'NDC11',
                'from': 'gssd5federals',
                'foreignField': 'NDC11',
                'as': 'gsdd5Federals'
              }
            },
            {
              $lookup: {
                'localField': 'gsdd5Federals.DEAClassificationID',
                'from': 'gsdd5deaclassifications',
                'foreignField': 'DEAClassificationID',
                'as': 'gsdd5DEAClassification'
              }
            },
            {
              $lookup: {
                'localField': 'gsdd5Product.MarketedProductID',
                'from': 'gsdd5marketedproductrxnormprescribablenames',
                'foreignField': 'MarketedProductID',
                'as': 'gsdd5MarketedProduct'
              }
            },

          ]
        ).then(result => {
          // console.log(result);
          resolve(result);
        })
          .catch(err => console.log(err));
        break;
      default:
        break;
    }

  });
}

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    // console.log(context.params.query.NDC11);
    if (context.result.total === 0) {
      let result = await findNdc11(context);
      context.result = result;
    }
    return context;
  };
};
