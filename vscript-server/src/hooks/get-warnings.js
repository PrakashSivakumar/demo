// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars

function Warning(context) {
  return new Promise(resolve => {
    switch(context.params.query.type){
      case 'warnings':
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
                'localField': 'gsdd5Product.ProductID',
                'from': 'gsdd5productwarninglabels',
                'foreignField': 'ProductID',
                'as': 'gsdd5productwarninglabels',
              }
            },
            {
              $sort: {'gsdd5productwarninglabels.WarningOrder': 1},
            },
            {
              $lookup: {
                'localField': 'gsdd5productwarninglabels.WarningLabelID',
                'from': 'gsdd5warninglabelshorts',
                'foreignField': 'WarningLabelID',
                'as': 'gsdd5warninglabelshorts'
              }
            },

            {
              $addFields: {
                'gsdd5warninglabelshorts': {
                  '$filter': {
                    'input': '$gsdd5warninglabelshorts',
                    'as': 'gsdd5warninglabelshorts',
                    'cond': {
                      '$eq': ['$$gsdd5warninglabelshorts.LanguageCode', 'en'],
                    },
                  },
                }
              },
            },
            {
              $lookup: {
                'localField': 'gsdd5warninglabelshorts.WarningLabelGroupID',
                'from': 'gsdd5warninglabelgroups',
                'foreignField': 'WarningLabelGroupID',
                'as': 'gsdd5warninglabelgroups'
              }
            },


            {
              $project: {
                'NDC11': 1,
                'ProductID': 1,
                'gsdd5Product': {
                  'ProductID': 1
                },
                'gsdd5productwarninglabels': {
                  'WarningLabelID': 1,
                  'WarningOrder': 1
                },
                'gsdd5warninglabelshorts': {
                  'WarningLabelID': 1,
                  'WarningLabelGroupID': 1,
                  'Warning': 1
                },
                'gsdd5warninglabelgroups': {
                  'GroupName': 1,
                  'WarningLabelGroupID': 1
                }
              }
            }
          ]

        ).then(result => {
          resolve(result);
        }).catch(err => console.log(err));
        break;
      case 'drugSheet':
        context.app.service('gsdd5-package').Model.aggregate([
          {
            $match:{
              NDC11: Number(context.params.query.ndc)
            },
          },
          {
            $lookup:{
              'localField':'ProductID',
              'from': 'gsdd5products',
              'foreignField': 'ProductID',
              'as': 'gsdd5products'
            }
          },
          {
            $lookup: {
              'localField':'ProductID',
              'from': 'gsdd5productpatientsheets',
              'foreignField':'ProductID',
              'as':'gsdd5productpatientsheets'
            }
          },
          {
            $lookup:{
              'localField':'gsdd5productpatientsheets.SheetID',
              'from':'gsdd5patienteducationint1',
              'foreignField': 'SheetId',
              'as':'gsdd5patienteducationint1'
            }
          }

        ]).then(result=>{
          resolve(result);
        }).catch(err=>console.log(err));
      default:
        break;
    }

  });
}

module.exports = function (options = {}) {
  return async context => {
    // let ndc11 = await getNDC(context);
    let result = await Warning(context);
    console.log('result', result);
    context.result = result;
    return context;
  };
};




// [
//   {
//     $match: {
//       NDC11: Number(context.params.query.NDC11)
//     }
//   },
//   {
//     $lookup: {
//       'localField': 'ProductID',
//       'from': 'gsdd5products',
//       'foreignField': 'ProductID',
//       'as': 'gsdd5Product'
//     }
//   },
//   {
//     $lookup: {
//       'localField': 'ProductID',
//       'from': 'gsdd5productwarninglabels',
//       'foreignField': 'ProductID',
//       'as': 'gsdd5productwarninglabels',
//     }
//   },
//
//   {
//     $lookup: {
//       'localField': 'gsdd5productwarninglabels.WarningLabelID',
//       'from': 'gsdd5warninglabelshorts',
//       'foreignField': 'WarningLabelID',
//       'as': 'gsdd5warninglabelshorts'
//     }
//   },
//   {
//     $addFields: {
//       'gsdd5warninglabelshorts': {
//         '$filter': {
//           'input': '$gsdd5warninglabelshorts',
//           'as': 'gsdd5warninglabelshorts',
//           'cond': {
//             '$eq': ['$$gsdd5warninglabelshorts.LanguageCode', 'en'],
//           },
//         },
//       }
//     },
//   },
//   {
//     $lookup: {
//       'localField': 'gsdd5warninglabelshorts.WarningLabelGroupID',
//       'from': 'gsdd5warninglabelgroups',
//       'foreignField': 'WarningLabelGroupID',
//       'as': 'gsdd5warninglabelgroups'
//     }
//   },
//   {
//     $sort: {'gsdd5productwarninglabels.WarningOrder': 1},
//   }
// ]

// [
//    {
//       $match: {
//         NDC11: Number(context.params.query.NDC11)
//       }
//    },
//   {
//   $lookup:
//     {
//       from: "gsdd5products",
//       let: { commonId: "$ProductID" },
//       pipeline: [
//         { $match:
//             { $expr:
//                 { $eq: [ "$ProductID",  "$$commonId" ] }
//             }
//         },
//       ],
//       as: "InnerJoin"
//     }
//   },
//   {
//     $lookup: {
//       from: "gsdd5productwarninglabels",
//       let: { commonId: "$ProductID" },
//       pipeline: [{ $match:{
//                     $expr: { $eq: ["$ProductID", "$$commonId"]}
//                     },
//                 }],
//       as: "LeftJoin"
//     }
//   },
//   // {
//   //   $sort: {'gsdd5productwarninglabels.WarningOrder': 1}
//   // },
//   // {   $unwind:"$LeftJoin" },
//   {
//     $addFields: {
//       'gsdd5warninglabelshorts': {
//         '$filter': {
//           'input': '$gsdd5warninglabelshorts',
//           'as': 'gsdd5warninglabelshorts',
//           'cond': {
//             '$eq': ['$$gsdd5warninglabelshorts.LanguageCode', 'en'],
//           },
//         },
//       }
//     }
//   },
//   {
//     $lookup: {
//       from: "gsdd5warninglabelshorts",
//       localField: "LeftJoin.WarningLabelID",
//       // let: { cid: "$LeftJoin.WarningLabelID"},
//       foreignField: "WarningLabelID",
//       // $match:{
//       //     $expr: { $eq: ['LanguageCode', 'en']}
//       //   },
//       as: "WarningLabel"
//     }
//   },
//
//   {
//     $project: {
//       "NDC11": 1,
//       "ProductID": 1,
//       "PackageID": 1,
//       "InnerJoin": {
//         "ProductID": 1,
//         "NDC9": 1,
//         "ProductNameLong": 1,
//         "ProductNameShort": 1,
//       },
//       "LeftJoin": {
//         "ProductID": 1,
//         "WarningLabelID": 1,
//         "WarningOrder": 1
//       },
//       "WarningLabel": {
//         "WarningLabelID": 1,
//         "WarningLabelGroupID": 1,
//         "Warning": 1,
//         "LanguageCode": 1
//       }
//     }
//   }
// ]
