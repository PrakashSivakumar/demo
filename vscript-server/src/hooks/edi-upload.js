// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const fs = require('fs');
const xml2js = require('xml2js');
let parser = new xml2js.Parser();
let jsonresult = [];
let ndcArray = [];
let chokidar = require('chokidar');

function edi832(path, context) {
  fs.readFile(path, function (err, data) {
    parser.parseString(data, function (err, result) {
      for (let i = 0; i < parseInt(result.Interchange.FunctionGroup[0].GE[0].GE01); i++) {
        // console.log("Set of Transactions available", i, result.Interchange.FunctionGroup[0].Transaction.length);
        // }
        // for (let i = 0; i < result.Interchange.FunctionGroup[0].Transaction.length; i++) {
        let countNumber = 1;
        for (let key in result.Interchange.FunctionGroup[0].Transaction[i].Loop) {
          // if (key <= "1") continue;
          if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].$.LoopId === "LIN") {
            for (let lin in result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].LIN) {
              let resultLIN = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].LIN[lin];
              resultLIN.LIN02 !== undefined ? jsonresult.push(resultLIN.LIN02[0]) : jsonresult.push('null');  // 0
              resultLIN.LIN03 !== undefined ? jsonresult.push(resultLIN.LIN03[0]) : jsonresult.push('null');  // 1
              resultLIN.LIN04 !== undefined ? jsonresult.push(resultLIN.LIN04[0]) : jsonresult.push('null');  // 2
              resultLIN.LIN05 !== undefined ? jsonresult.push(resultLIN.LIN05[0]) : jsonresult.push('null');  // 3
              resultLIN.LIN06 !== undefined ? jsonresult.push(resultLIN.LIN06[0]) : jsonresult.push('null');  // 4
              resultLIN.LIN07 !== undefined ? jsonresult.push(resultLIN.LIN07[0]) : jsonresult.push('null');  // 5
            }

            for (let pid in result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].PID) {
              let resultPID = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].PID[pid];
              resultPID.PID01 !== undefined ? jsonresult.push(resultPID.PID01[0]) : jsonresult.push('null');  // 6
              resultPID.PID02 !== undefined ? jsonresult.push(resultPID.PID02[0]) : jsonresult.push('null');  // 7
              resultPID.PID05 !== undefined ? jsonresult.push(resultPID.PID05[0]) : jsonresult.push('null');  // 8
            }

            for (let po4 in result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].PO4) {
              let resultPO4 = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].PO4[po4];
              resultPO4.PO403 !== undefined ? jsonresult.push(resultPO4.PO403[0]) : jsonresult.push('null');  // 9
            }

            for (let ctp in result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop) {
              if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop.length === 4) {
                if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].$.LoopId === "CTP") {
                  let resultCTP = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].CTP[0];
                  resultCTP.CTP03 !== undefined ? jsonresult.push(resultCTP.CTP03[0]) : jsonresult.push('null');  // 10,11,12
                }
                if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].$.LoopId === "N1") {
                  // jsonresult.push('null');
                  let resultN1 = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].N1[0];
                  resultN1.N102 !== undefined ? jsonresult.push(resultN1.N102[0]) : jsonresult.push('null');  // 13
                }
              }
              else {
                if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].$.LoopId === "CTP") {
                  let resultCTP = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].CTP[0];
                  resultCTP.CTP03 !== undefined ? jsonresult.push(resultCTP.CTP03[0]) : jsonresult.push('null');  // 10,11
                }
                if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].$.LoopId === "N1") {
                  jsonresult.push('null');  // 12
                  let resultN1 = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].N1[0];
                  resultN1.N102 !== undefined ? jsonresult.push(resultN1.N102[0]) : jsonresult.push('null');  // 13
                }
              }
            }

          }

          let packages = {
            SerialNo: countNumber,
            PackageId: '',
            productOrServiceIDQuailifier1: jsonresult[0],
            productOrServiceID1: jsonresult[1],
            productOrServiceIDQuailifier2: jsonresult[2],
            productOrServiceID2: jsonresult[3],
            NDC11Qualifier: jsonresult[4],
            NDC11: jsonresult[5],
            itemDescriptionType: jsonresult[6],
            PID02: jsonresult[7],
            itemDescription: jsonresult[8],
            UnitOfMeasure: jsonresult[9],
            INVPrice: jsonresult[10],
            AWPPrice: jsonresult[11],
            RESPrice: jsonresult[12],
            ManufacturedBy: jsonresult[13],
            ProductId: '',
            PackageSize: 0
          };
          console.log('package:', packages, countNumber);

          let fun = context.app.service('package').Model.create(packages);
          countNumber++;
          jsonresult = [];
        }
      }
    });
  });
}

function edi810(path, context) {
  fs.readFile(path, function (err, data) {
    parser.parseString(data, function (err, result) {
      for (let key in result.Interchange.FunctionGroup[0].Transaction[0].Loop) {
        if (result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].$.LoopId === "IT1") {
          let resultIT1 = result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].IT1[0];
          resultIT1.IT101 !== undefined ? jsonresult.push(resultIT1.IT101[0]) : jsonresult.push('null');
          resultIT1.IT102 !== undefined ? jsonresult.push(resultIT1.IT102[0]) : jsonresult.push('null');
          resultIT1.IT103 !== undefined ? jsonresult.push(resultIT1.IT103[0]) : jsonresult.push('null');
          resultIT1.IT104 !== undefined ? jsonresult.push(resultIT1.IT104[0]) : jsonresult.push('null');
          // resultIT1.IT105 !== undefined ? jsonresult.push(resultIT1.IT105[0]) : jsonresult.push('null');
          resultIT1.IT106 !== undefined ? jsonresult.push(resultIT1.IT106[0]) : jsonresult.push('null');
          resultIT1.IT107 !== undefined ? jsonresult.push(resultIT1.IT107[0]) : jsonresult.push('null');
        }
        if (result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].$.LoopId === "IT1") {
          let resultPID = result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].Loop[0].PID[0];
          resultPID.PID01 !== undefined ? jsonresult.push(resultPID.PID01[0]) : jsonresult.push('null');
          // resultPID.PID02 !== undefined ? jsonresult.push(resultPID.PID02[0]) : jsonresult.push('null');
          resultPID.PID03 !== undefined ? jsonresult.push(resultPID.PID03[0]) : jsonresult.push('null');
          resultPID.PID04 !== undefined ? jsonresult.push(resultPID.PID04[0]) : jsonresult.push('null');
          resultPID.PID05 !== undefined ? jsonresult.push(resultPID.PID05[0]) : jsonresult.push('null');
        }

        let product = {
          assignedIdentification: jsonresult[0],
          quantityInvoiced: jsonresult[1],
          unitforMeasurement: jsonresult[2],
          unitPrice: jsonresult[3],
          productOrServiceIDQualifier: jsonresult[4],
          productOrServiceID: jsonresult[5],
          NDC11Qualifier: '',
          NDC11: '',
          itemDescriptionType: jsonresult[6],
          PID03: jsonresult[7],
          PID04: jsonresult[8],
          itemDescription: jsonresult[9],
          DeaClassificationId: 0,
          ProductId: 0,
          NDC9: ''
        };
        console.log('product:', product);
        if (jsonresult.length > 0) {
          let createFun = context.app.service('product').Model.create(product);
        }
        jsonresult = [];
      }

      // let invoicedetails = [];
      // invoicedetails.push(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG02["0"]);
      // invoicedetails.push((result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(0,4)+'-'+(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(4,6)+'-'+(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(6,8));
      // invoicedetails.push(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG04["0"]);
      // invoicedetails.push('Debit Memo');
      // invoicedetails.push(result.Interchange.FunctionGroup["0"].Transaction["0"].Loop["0"].N1["0"].N102);
      // invoicedetails.push('');
      // invoicedetails.push('');
      // invoicedetails.push('Basic');
      // invoicedetails.push(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]);
      // invoicedetails.push((result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(0,4)+'-'+(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(4,6)+'-'+(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(6,8));
      // invoicedetails.push((result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(0,4)+'-'+(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(4,6)+'-'+(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(6,8));
      //
      //   let productInvoiceDetails = {
      //     invoiceNumber: invoicedetails[0],
      //     date: invoicedetails[1],
      //     purchaseOrderNumber: invoicedetails[2],
      //     transactionTypeCode: invoicedetails[3],
      //     partyToReceiveCommercialInvoiceRemittance: invoicedetails[4],
      //     shipTo: invoicedetails[5],
      //     billToParty: invoicedetails[6],
      //     termsTypeCode: invoicedetails[7],
      //     termsBasisDateCode: invoicedetails[8],
      //     termsNetDueDate: invoicedetails[9],
      //     receivedDate: invoicedetails[10]
      //   };
      //   console.log('product:', productInvoiceDetails);
      //   if(invoicedetails.length > 0) {
      //     console.log('length:',invoicedetails.length);
      //     let createFun = context.app.service('product-invoice-details').Model.create(productInvoiceDetails);
      //   }
      console.log('Done');
    });
  });
}

async function updateProducts(context) {
  context.app.service('package').find({
    query: {
      'NDC11': {$ne: "null"},
      $limit: false,
      $select: ['NDC11']
    }
  }).then(result => {
    console.log('package all results:', result['data'][0].NDC11, result['total']);
    let ndc11 = [];
    for (let i = 0; i < result['total']; i++) {
      let ndc = (result['data'][i].NDC11).replace(/^0+/, '');
      console.log('ndc', ndc);
      context.app.service('package').find({
        query: {
          'NDC11': ndc,
          'type': 'ndc',
          // $select: ['PackageID, ProductID, PackageSize']
        },

      }).then(result => {
        console.log('result gsdd5:', result[0].PackageID, result[0].ProductID);
        context.app.service('product').findOneAndUpdate({})

      })
    }

  })


}

async function startUpload(context) {
  // let data = await fs.readFile('public/EDI810-Products/mhsin770634.71TMLL.xml');
  // let result = await parser.parseString(data);

  // This is to insert Products

  // fs.readFile('public/EDI810-Products/mhsin770634.71TMLL.xml', function (err, data) {
  //   parser.parseString(data, function (err, result) {
  //     for (let key in result.Interchange.FunctionGroup[0].Transaction[0].Loop) {
  //       if (result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].$.LoopId === "IT1") {
  //         let resultIT1 = result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].IT1[0];
  //         resultIT1.IT101 !== undefined ? jsonresult.push(resultIT1.IT101[0]) : jsonresult.push('null');
  //         resultIT1.IT102 !== undefined ? jsonresult.push(resultIT1.IT102[0]) : jsonresult.push('null');
  //         resultIT1.IT103 !== undefined ? jsonresult.push(resultIT1.IT103[0]) : jsonresult.push('null');
  //         resultIT1.IT104 !== undefined ? jsonresult.push(resultIT1.IT104[0]) : jsonresult.push('null');
  //         resultIT1.IT105 !== undefined ? jsonresult.push(resultIT1.IT105[0]) : jsonresult.push('null');
  //         resultIT1.IT106 !== undefined ? jsonresult.push(resultIT1.IT106[0]) : jsonresult.push('null');
  //         resultIT1.IT107 !== undefined ? jsonresult.push(resultIT1.IT107[0]) : jsonresult.push('null');
  //       }
  //       if (result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].$.LoopId === "IT1") {
  //         let resultPID = result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].Loop[0].PID[0];
  //         resultPID.PID01 !== undefined ? jsonresult.push(resultPID.PID01[0]) : jsonresult.push('null');
  //         resultPID.PID02 !== undefined ? jsonresult.push(resultPID.PID02[0]) : jsonresult.push('null');
  //         resultPID.PID03 !== undefined ? jsonresult.push(resultPID.PID03[0]) : jsonresult.push('null');
  //         resultPID.PID04 !== undefined ? jsonresult.push(resultPID.PID04[0]) : jsonresult.push('null');
  //         resultPID.PID05 !== undefined ? jsonresult.push(resultPID.PID05[0]) : jsonresult.push('null');
  //       }
  //       let product = {
  //         assignedIdentification: jsonresult[0],
  //         quantityInvoiced: jsonresult[1],
  //         UnitforMeasurement: jsonresult[2],
  //         unitPrice: jsonresult[3],
  //         unUsed: jsonresult[4],
  //         productOrServiceIDQualifier: jsonresult[5],
  //         productOrServiceID: jsonresult[6],
  //         itemDescriptionType: jsonresult[7],
  //         PID02: jsonresult[8],
  //         PID03: jsonresult[9],
  //         PID04: jsonresult[10],
  //         itemDescription: jsonresult[11]
  //       };
  //       console.log('product:', product);
  //       if(jsonresult.length > 0) {
  //         let createFun = context.app.service('product').Model.create(product);
  //       }
  //       jsonresult = [];
  //     }
  //
  //     // let invoicedetails = [];
  //     // invoicedetails.push(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG02["0"]);
  //     // invoicedetails.push((result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(0,4)+'-'+(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(4,6)+'-'+(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(6,8));
  //     // invoicedetails.push(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG04["0"]);
  //     // invoicedetails.push('Debit Memo');
  //     // invoicedetails.push(result.Interchange.FunctionGroup["0"].Transaction["0"].Loop["0"].N1["0"].N102);
  //     // invoicedetails.push('');
  //     // invoicedetails.push('');
  //     // invoicedetails.push('Basic');
  //     // invoicedetails.push(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]);
  //     // invoicedetails.push((result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(0,4)+'-'+(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(4,6)+'-'+(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(6,8));
  //     // invoicedetails.push((result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(0,4)+'-'+(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(4,6)+'-'+(result.Interchange.FunctionGroup["0"].Transaction["0"].BIG["0"].BIG03["0"]).slice(6,8));
  //     //
  //     //   let productInvoiceDetails = {
  //     //     invoiceNumber: invoicedetails[0],
  //     //     date: invoicedetails[1],
  //     //     purchaseOrderNumber: invoicedetails[2],
  //     //     transactionTypeCode: invoicedetails[3],
  //     //     partyToReceiveCommercialInvoiceRemittance: invoicedetails[4],
  //     //     shipTo: invoicedetails[5],
  //     //     billToParty: invoicedetails[6],
  //     //     termsTypeCode: invoicedetails[7],
  //     //     termsBasisDateCode: invoicedetails[8],
  //     //     termsNetDueDate: invoicedetails[9],
  //     //     receivedDate: invoicedetails[10]
  //     //   };
  //     //   console.log('product:', productInvoiceDetails);
  //     //   if(invoicedetails.length > 0) {
  //     //     console.log('length:',invoicedetails.length);
  //     //     let createFun = context.app.service('product-invoice-details').Model.create(productInvoiceDetails);
  //     //   }
  //     console.log('Done');
  //     });
  // });

  // This is to insert Packages

  // fs.readFile('public/EDI832-Packages/edi832_DSB5_0000770634_20180318195611_001.txt.xml', function (err, data) {
  //   parser.parseString(data, function (err, result) {
  //     console.log('res',result);
  //     for (let key in result.Interchange.FunctionGroup[0].Transaction[0].Loop) {
  //       if (key <= "1") continue;
  //       let count = 1;
  //       if (result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].$.LoopId === "LIN") {
  //         for (let lin in result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].LIN) {
  //           let resultLIN = result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].LIN[lin];
  //           resultLIN.LIN01 !== undefined ? jsonresult.push(resultLIN.LIN01[0]) : jsonresult.push('null');
  //           resultLIN.LIN02 !== undefined ? jsonresult.push(resultLIN.LIN02[0]) : jsonresult.push('null');
  //           resultLIN.LIN03 !== undefined ? jsonresult.push(resultLIN.LIN03[0]) : jsonresult.push('null');
  //           resultLIN.LIN04 !== undefined ? jsonresult.push(resultLIN.LIN04[0]) : jsonresult.push('null');
  //           resultLIN.LIN05 !== undefined ? jsonresult.push(resultLIN.LIN05[0]) : jsonresult.push('null');
  //           resultLIN.LIN06 !== undefined ? jsonresult.push(resultLIN.LIN06[0]) : jsonresult.push('null');
  //           resultLIN.LIN07 !== undefined ? jsonresult.push(resultLIN.LIN07[0]) : jsonresult.push('null');
  //         }
  //
  //         for (let REF in result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].REF) {
  //           let resultREF = result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].REF[REF];
  //           resultREF.REF01 !== undefined ? jsonresult.push(resultREF.REF01[0]) : jsonresult.push('null');
  //           resultREF.REF02 !== undefined ? jsonresult.push(resultREF.REF02[0]) : jsonresult.push('null');
  //         }
  //
  //         for (let pid in result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].PID) {
  //           let resultPID = result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].PID[pid];
  //           resultPID.PID01 !== undefined ? jsonresult.push(resultPID.PID01[0]) : jsonresult.push('null');
  //           resultPID.PID02 !== undefined ? jsonresult.push(resultPID.PID02[0]) : jsonresult.push('null');
  //           resultPID.PID03 !== undefined ? jsonresult.push(resultPID.PID03[0]) : jsonresult.push('null');
  //           resultPID.PID04 !== undefined ? jsonresult.push(resultPID.PID04[0]) : jsonresult.push('null');
  //           resultPID.PID05 !== undefined ? jsonresult.push(resultPID.PID05[0]) : jsonresult.push('null');
  //         }
  //
  //         for (let po4 in result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].PO4) {
  //           let resultPO4 = result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].PO4[po4];
  //           resultPO4.PO401 !== undefined ? jsonresult.push(resultPO4.PO401[0]) : jsonresult.push('null');
  //           resultPO4.PO402 !== undefined ? jsonresult.push(resultPO4.PO402[0]) : jsonresult.push('null');
  //           resultPO4.PO403 !== undefined ? jsonresult.push(resultPO4.PO403[0]) : jsonresult.push('null');
  //         }
  //
  //         for (let ctp in result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].Loop) {
  //           if (result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].Loop.length === 3) {
  //             if (result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].Loop[ctp].$.LoopId === "CTP" && count === 1) {
  //               let resultCTP = result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].Loop[ctp].CTP[0];
  //               resultCTP.CTP02 !== undefined ? jsonresult.push(resultCTP.CTP02[0]) : jsonresult.push('null');
  //               resultCTP.CTP03 !== undefined ? jsonresult.push(resultCTP.CTP03[0]) : jsonresult.push('null');
  //             } else if (result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].Loop[ctp].$.LoopId === "N1") {
  //               let resultN1 = result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].Loop[ctp].N1[0];
  //               resultN1.N101 !== undefined ? jsonresult.push(resultN1.N101[0]) : jsonresult.push('null');
  //               resultN1.N102 !== undefined ? jsonresult.push(resultN1.N102[0]) : jsonresult.push('null');
  //             }
  //           } else if (result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].Loop.length === 2) {
  //             if (result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].Loop[ctp].$.LoopId === "CTP" && count === 1) {
  //               let resultCTP = result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].Loop[ctp].CTP[0];
  //               resultCTP.CTP02 !== undefined ? jsonresult.push(resultCTP.CTP02[0]) : jsonresult.push('null');
  //               resultCTP.CTP03 !== undefined ? jsonresult.push(resultCTP.CTP03[0]) : jsonresult.push('null');
  //             } else if (result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].Loop[ctp].$.LoopId === "N1") {
  //               jsonresult.push('null');
  //               jsonresult.push('null');
  //               let resultN1 = result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].Loop[ctp].N1[0];
  //               resultN1.N101 !== undefined ? jsonresult.push(resultN1.N101[0]) : jsonresult.push('null');
  //               resultN1.N102 !== undefined ? jsonresult.push(resultN1.N102[0]) : jsonresult.push('null');
  //             }
  //           }
  //         }
  //       }
  //
  //       let package = {
  //         assignedIdentification: key,
  //         productOrServiceIDQuailifier1: jsonresult[1],
  //         productOrServiceID1: jsonresult[2],
  //         productOrServiceIDQuailifier2: jsonresult[3],
  //         productOrServiceID2: jsonresult[4],
  //         productOrServiceIDQuailifier3: jsonresult[5],
  //         productOrServiceID3: jsonresult[6],
  //         referenceIdentificationQualifier: jsonresult[7],
  //         referenceIdentification: jsonresult[8],
  //         itemDescriptionType: jsonresult[9],
  //         PID02: jsonresult[10],
  //         PID03: jsonresult[11],
  //         PID04: jsonresult[12],
  //         itemDescription: jsonresult[13],
  //         PO401: jsonresult[14],
  //         PO402: jsonresult[15],
  //         PO403: jsonresult[16],
  //         priceIdentifierCode1: jsonresult[17],
  //         unitPrice1: jsonresult[18],
  //         priceIdentifierCode2: jsonresult[19],
  //         unitPrice2: jsonresult[20],
  //         entityIdentifierCode: jsonresult[21],
  //         Name: jsonresult[22]
  //       };
  //       console.log('package:', package);
  //       if(jsonresult.length > 0) {
  //         console.log('key count',key);
  //         // let createFun = context.app.service('package').Model.create(package);
  //       }
  //       jsonresult = [];
  //     }
  //     console.log('Done');
  //     });
  // });
}

function startUploadPackages(context, result) {
  return new Promise((resolve, reject) => {
    let count = 0;
    for (let i = 0; i < result.Interchange.FunctionGroup[0].Transaction.length; i++) {
      console.log('len', i);
      resolve(i);
      for (let key in result.Interchange.FunctionGroup[0].Transaction[i].Loop) {
        if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].$.LoopId === "LIN") {
          count = count + 1;
          for (let lin in result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].LIN) {
            let resultLIN = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].LIN[lin];
            resultLIN.LIN01 !== undefined ? jsonresult.push(resultLIN.LIN01[0]) : jsonresult.push('null');
            resultLIN.LIN02 !== undefined ? jsonresult.push(resultLIN.LIN02[0]) : jsonresult.push('null');
            resultLIN.LIN03 !== undefined ? jsonresult.push(resultLIN.LIN03[0]) : jsonresult.push('null');
            resultLIN.LIN04 !== undefined ? jsonresult.push(resultLIN.LIN04[0]) : jsonresult.push('null');
            resultLIN.LIN05 !== undefined ? jsonresult.push(resultLIN.LIN05[0]) : jsonresult.push('null');
            resultLIN.LIN06 !== undefined ? jsonresult.push(resultLIN.LIN06[0]) : jsonresult.push('null');
            resultLIN.LIN07 !== undefined ? jsonresult.push(resultLIN.LIN07[0]) : jsonresult.push('null');
          }

          let resultG53 = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key];
          resultG53.G53 !== undefined ? jsonresult.push(resultG53.G53[0].G5301[0]) : jsonresult.push('null');

          for (let pid in result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].PID) {
            let resultPID = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].PID[pid];
            resultPID.PID01 !== undefined ? jsonresult.push(resultPID.PID01[0]) : jsonresult.push('null');
            resultPID.PID02 !== undefined ? jsonresult.push(resultPID.PID02[0]) : jsonresult.push('null');
            resultPID.PID05 !== undefined ? jsonresult.push(resultPID.PID05[0]) : jsonresult.push('null');
          }

          for (let ctp in result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop) {
            if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop.length === 4) {
              if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].$.LoopId === "CTP") {
                let resultCTP = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].CTP[0];
                resultCTP.CTP03 !== undefined ? jsonresult.push(resultCTP.CTP03[0]) : jsonresult.push('null');  // 12,13,14 js[11],js[12],js[13]
              }
              if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].$.LoopId === "N1") {
                let resultN1 = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].N1[0];
                resultN1.N102 !== undefined ? jsonresult.push(resultN1.N102[0]) : jsonresult.push('null');  // 15
              }
            }
            else {
              if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].$.LoopId === "CTP") {
                let resultCTP = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].CTP[0];
                resultCTP.CTP03 !== undefined ? jsonresult.push(resultCTP.CTP03[0]) : jsonresult.push('null');  // 10,11
              }
              if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].$.LoopId === "N1") {
                jsonresult.push('null');  // 12
                let resultN1 = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].N1[0];
                resultN1.N102 !== undefined ? jsonresult.push(resultN1.N102[0]) : jsonresult.push('null');  // 13
              }
            }
          }
          if (jsonresult[1] == "VN") {
            jsonresult.push(jsonresult[2]); // 15
          } else {
            jsonresult.push('null');
          }
        }

        let druglistEDI = {
          packageId: jsonresult[0],
          UPC: jsonresult[4],
          NDC: jsonresult[6],
          UnitPrice: jsonresult[11],
          AWPUnitPrice: jsonresult[12],
          RESUnitPrice: jsonresult[13],
          DrugName: jsonresult[10],
          Brand: jsonresult[14],
          VendorProductNumber: jsonresult[15],
          Invoiced: 'N',
          DrugType: jsonresult[9],
        };

        console.log('length:', jsonresult.length, druglistEDI, count);
        let insertdrug = context.app.service('druglist-edi').Model.create(druglistEDI);

        jsonresult = [];
      }
    }
    console.log('Done');
  });
}


async function druglistEDI(path, context) {
  fs.readFile(path, function (err, data) {
    parser.parseString(data, function (err, result) {
      let count = 0;
      for (let i = 0; i < result.Interchange.FunctionGroup[0].Transaction.length; i++) {
        for (let key in result.Interchange.FunctionGroup[0].Transaction[i].Loop) {
          if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].$.LoopId === "LIN") {
            count = count + 1;
            for (let lin in result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].LIN) {
              let resultLIN = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].LIN[lin];
              resultLIN.LIN01 !== undefined ? jsonresult.push(resultLIN.LIN01[0]) : jsonresult.push('null');
              resultLIN.LIN02 !== undefined ? jsonresult.push(resultLIN.LIN02[0]) : jsonresult.push('null');
              resultLIN.LIN03 !== undefined ? jsonresult.push(resultLIN.LIN03[0]) : jsonresult.push('null');
              resultLIN.LIN04 !== undefined ? jsonresult.push(resultLIN.LIN04[0]) : jsonresult.push('null');
              resultLIN.LIN05 !== undefined ? jsonresult.push(resultLIN.LIN05[0]) : jsonresult.push(null);  // UPC
              resultLIN.LIN06 !== undefined ? jsonresult.push(resultLIN.LIN06[0]) : jsonresult.push('null');
              resultLIN.LIN07 !== undefined ? jsonresult.push((resultLIN.LIN07[0]).replace(/^0+/, '')) : jsonresult.push(null);  // NDC
            }

            let resultG53 = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key];
            resultG53.G53 !== undefined ? jsonresult.push(resultG53.G53[0].G5301[0]) : jsonresult.push('null');

            for (let pid in result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].PID) {
              let resultPID = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].PID[pid];
              resultPID.PID01 !== undefined ? jsonresult.push(resultPID.PID01[0]) : jsonresult.push('null');
              resultPID.PID02 !== undefined ? jsonresult.push(resultPID.PID02[0]) : jsonresult.push('null');
              resultPID.PID05 !== undefined ? jsonresult.push(resultPID.PID05[0]) : jsonresult.push('null');
            }

            for (let ctp in result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop) {
              if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop.length === 4) {
                if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].$.LoopId === "CTP") {
                  let resultCTP = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].CTP[0];
                  resultCTP.CTP03 !== undefined ? jsonresult.push(resultCTP.CTP03[0]) : jsonresult.push(null);  // js[11],js[12],js[13]
                }
                if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].$.LoopId === "N1") {
                  let resultN1 = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].N1[0];
                  resultN1.N102 !== undefined ? jsonresult.push(resultN1.N102[0]) : jsonresult.push('');  // js[14]
                }
              }
              else {
                if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].$.LoopId === "CTP") {
                  let resultCTP = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].CTP[0];
                  resultCTP.CTP03 !== undefined ? jsonresult.push(resultCTP.CTP03[0]) : jsonresult.push(null);  // js[11],js[12]
                }
                if (result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].$.LoopId === "N1") {
                  jsonresult.push(null);  // js[13]
                  let resultN1 = result.Interchange.FunctionGroup[0].Transaction[i].Loop[key].Loop[ctp].N1[0];
                  resultN1.N102 !== undefined ? jsonresult.push(resultN1.N102[0]) : jsonresult.push('');  // js[14]
                }
              }
            }
            if (jsonresult[1] == "VN") {
              jsonresult.push(jsonresult[2]); // 15
            } else {
              jsonresult.push(null);
            }
          }

          let druglistEDI = {
            packageId: jsonresult[0],
            UPC: jsonresult[4],
            NDC11: jsonresult[6],
            UnitPrice: jsonresult[11],
            AWPUnitPrice: jsonresult[12],
            RESUnitPrice: jsonresult[13],
            DrugName: jsonresult[10],
            Brand: jsonresult[14],
            VendorProductNumber: jsonresult[15],
            Invoiced: 'N',
            DrugType: jsonresult[9],
            orderedQuantity: null,
            unitOfMeasure: '',
            dirUnitPrice: null,
            deaClassificationId: null,
            packageSize: null,
            productId: null,
            form: '',
            strength: '',
            unitCode: '',
            DrugDescription: '',
            inHandQty: null
          };

          console.log('length:', jsonresult.length, druglistEDI, count);
          let insertdrug = context.app.service('druglist-edi').Model.create(druglistEDI);
          jsonresult = [];
        }
      }
      console.log('Done');
    });
  });
}

async function druglistEDIUpdate(path, context) {
  fs.readFile(path, function (err, data) {
    parser.parseString(data, function (err, result) {
      for (let key in result.Interchange.FunctionGroup[0].Transaction[0].Loop) {
        if (result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].$.LoopId === "IT1") {
          let resultIT1 = result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].IT1[0];
          resultIT1.IT101 !== undefined ? jsonresult.push(resultIT1.IT101[0]) : jsonresult.push('null');
          resultIT1.IT102 !== undefined ? jsonresult.push(resultIT1.IT102[0]) : jsonresult.push(null);
          resultIT1.IT103 !== undefined ? jsonresult.push(resultIT1.IT103[0]) : jsonresult.push(null);
          resultIT1.IT104 !== undefined ? jsonresult.push(resultIT1.IT104[0]) : jsonresult.push(null);
          resultIT1.IT105 !== undefined ? jsonresult.push(resultIT1.IT105[0]) : jsonresult.push('null');
          resultIT1.IT106 !== undefined ? jsonresult.push(resultIT1.IT106[0]) : jsonresult.push('null');
          resultIT1.IT107 !== undefined ? jsonresult.push(resultIT1.IT107[0]) : jsonresult.push(null);
        }
        if (result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].$.LoopId === "IT1") {
          let resultPID = result.Interchange.FunctionGroup[0].Transaction[0].Loop[key].Loop[0].PID[0];
          resultPID.PID01 !== undefined ? jsonresult.push(resultPID.PID01[0]) : jsonresult.push('null');
          resultPID.PID03 !== undefined ? jsonresult.push(resultPID.PID03[0]) : jsonresult.push('null');
          resultPID.PID04 !== undefined ? jsonresult.push(resultPID.PID04[0]) : jsonresult.push('null');
          resultPID.PID05 !== undefined ? jsonresult.push(resultPID.PID05[0]) : jsonresult.push('null');
        }

        let updatedrug = {
          Id: jsonresult[0],
          Quantity: jsonresult[1],
          UOM: jsonresult[2],
          UnitPrice: jsonresult[3],
          EMpty: jsonresult[4],
          VendorIDQ: jsonresult[5],
          VendorID: jsonresult[6],
          FormType: jsonresult[7],
          PID03: jsonresult[8],
          PID04: jsonresult[9],
          PID05: jsonresult[10],
          Invoiced: 'Y'
        };
        console.log('length', updatedrug, jsonresult.length);
        if (jsonresult.length > 0) {
          let updateproduct = context.app.service('druglist-edi').Model.update({
            query: {
              "VendorProductNumber": jsonresult[6],
              $set: {
                "orderedQuantity": jsonresult[1],
                "unitOfMeasure": jsonresult[2],
                "dirUnitPrice": jsonresult[3],
                "Invoiced": 'Y'
              }
            }
          });
        }

        jsonresult = [];
      }
      console.log('Done');
    });
  });
}

async function druglistDEAupdate(context) {
  return new Promise((resolve, reject) => {
    context.app.service('druglist-edi').find({
      query: {
        $limit: false
      }
    }).then(result => {
      for (let i = 0; i < result.total; i++) {
        if (result.data[i].NDC11 !== 'null') {
          ndcArray.push(result.data[i].NDC11);
        }
      }
      console.log('array and count', ndcArray, ndcArray.length);
      resolve(ndcArray);
    });
  });
}

function getDEA(result, context) {
  return new Promise((resolve, reject) => {
    context.app.service('package').find({
      query: {
        'NDC11': result,
        'type': 'ndc'
      }
    }).then(result => {
      if (result['length'] !== 0) {
        resolve(result[0].gsdd5DEAClassification[0].DEAClassificationID);
      } else {
        resolve(undefined);
      }
    }).catch(err => reject(err));
  });
}

module.exports = function (options = {}) {
  return async context => {
    console.log(context);
    if (context.params.query.inventory !== true) {
      // --------- These are the working steps ---------------------

      // Step 1: This is to insert into Druglist EDI

      // let druglist = chokidar.watch('public/EDI832-Packages/edi832_DSB5_0000770634_20180318195611_001.txt.xml');
      // druglist.on('add', (path) =>{
      //   setTimeout(function () {
      //     druglistEDI(path, context);
      //     }, 3000);
      // });

      // Step 2: Update Druglist EDI with Products EDI

      // let Updatedruglist = chokidar.watch('public/EDI810-Products/mhsin770634.71TMLL.xml');
      // Updatedruglist.on('add', (path) =>{
      //   setTimeout(function () {
      //     druglistEDIUpdate(path, context);
      //   }, 3000);
      // });

      // Step 3: Update DEAClssID to Druglist EDI

      // let count = 0;
      // let getDEAClassID;
      // let update = await druglistDEAupdate(context);
      // console.log('update',update.length, update[0],update[1], update[2],update[3],update[501]);
      // for(let i=0; i<update.length; i++) {
      //   getDEAClassID = await getDEA(update[i], context);
      //   if(getDEAClassID !== undefined) {
      //     count = count + 1;
      //     console.log('getDEAClassID',getDEAClassID, count);
      //     context.app.service('druglist-edi').find({
      //       query: {
      //         "NDC11": update[i]
      //       }
      //     }).then(result =>{
      //       console.log('update id', result.data[0]._id);
      //       context.app.service('druglist-edi').patch(result.data[0]._id, {
      //         $set: { "deaClassificationId": getDEAClassID }
      //       });
      //     });
      //   }
      // }

      context.result = 'Upload Started!';

    }

    // startUpload(context);
    // let data = await fs.readFile('public/EDI832-Packages/edi832_DSB5_0000770634_20180318195611_001.txt.xml');
    // let result = await parser.parseString(data);
    // let abc = await startUploadPackages(context, result);

    // This is to upload packages to DB
    // let watchEdi832 = chokidar.watch('public/EDI832-Packages/*.xml');
    // watchEdi832.on('add', (path) => {
    //   setTimeout(function () { edi832(path,context); }, 3000);
    // });

    // This is to upload products to DB
    // let watchEdi810 = chokidar.watch('public/EDI810-Products/*.xml');
    // watchEdi810.on('add', (path) => {
    //   setTimeout(function () { edi810(path,context); }, 3000);
    // });

    // This is to Update Products Collection
    // let updateProduct = await updateProducts(context);
    return context;
  };
};
