// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html
const sql = require('mssql');

//
// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    const config = context.app.get('mssql');

    sql.connect(config, err => {
      // ... error checks

      const request = new sql.Request();
      const request2 = new sql.Request();
      const request3 = new sql.Request();
      let count = 0;

      //
      request.stream = true; // You can set streaming differently for each request
      request.query('select * from [dbo].[ReceivedRx_New] where [Status]=4'); // or request.execute(procedure)

      request.on('recordset', columns => {
        // Emitted once for each recordset in a query
        // console.log(columns);

      });

      request.on('row', row => {
        // Emitted for each row in a recordset
        let obj = row;
        console.log(row);

        function savePatient(patient) {
          return new Promise((resolve, reject) => {
            context.app.service('patient').Model.findOneAndUpdate({
              'name.firstName': patientName[0],
              'name.lastName': patientName[1],
              'contact.phone': obj.Phone
            }, patient, {upsert: true, new: true}).then(result => {
              resolve(result._id);
              // console.log(!Array.isArray(result) || !result.length);
              // if (!Array.isArray(result) || !result.length) {
              //   context.app.service('patient').Model.create(patient)
              //     .then(result => {
              //       // console.log('createPatietn',result);
              //       resolve(result._id);
              //     }).catch(err => reject(err));
              // }
              // else {
              //   resolve(result.data[0]._id);
              // }
            }).catch(err => reject(err));
          });
        }

        function savePrescriber(prescriber) {
          return new Promise((resolve, reject) => {
            context.app.service('prescriber').Model.findOneAndUpdate({
              'name.firstName': obj.Presriber.substring(0, obj.Presriber.indexOf(' ')),
              'name.lastName': obj.Presriber.substring(obj.Presriber.indexOf(' ') + 1),
            }, prescriber, {upsert: true, new: true}).then(result => {
              resolve(result._id);
              // if (result.total !== 0) {
              //   resolve(result.data[0]._id);
              // }
              // else {
              //   context.app.service('prescriber').create(prescriber, context.params).then(result => {
              //     resolve(result._id);
              //   });
              // }
            }).catch(err => reject(err));
          });
        }

        function getClassificationId(id) {
          return new Promise((resolve, reject) => {
            context.app.service('package').find({
              query: {
                'NDC11': id,
              }
            }).then(result => {
              resolve(result[0].gsdd5Product[0].DEAClassificationID);
            })
              .catch(err => reject(err));
          });
        }

        function getProductName(id) {
          return new Promise((resolve, reject) => {
            context.app.service('package').find({
              query: {
                'NDC11': Number(id),
              }
            }).then(result => {
              // if(result[0]){
              //   resolve('');
              // }else{
              resolve(result[0].gsdd5Product[0]._id);
              // }
            })
              .catch(err => reject(err));
          });
        }

        function patchCounters(rxNumber) {
          return new Promise((resolve, reject) => {
            context.app.service('counters').Model.findOneAndUpdate(null, {
              $inc: {[rxNumber]: 1}
            }, {new: true}).then(result => {
              resolve(result[rxNumber]);
            })
              .catch(err => reject(err));
            // context.app.service('counters').patch(null, {
            //   $inc: {[rxNumber]: 1}
            // }).then(result => {
            //   resolve(result[0][rxNumber]);
            // });
          });
        }

        function saveRx(rx) {
          return new Promise((resolve, reject) => {
            // console.log('context',context.params)
            context.app.service('rx').create(rx, context.params).then(result => {
              // console.log('rxresult', result);
              // resolve(result._id);
            })
              .catch(err => reject(err));
          });
        }

        //
        //
        const patientName = obj.PatientName.trim().split(' ');
        let addressLine1 = obj.Address.trim().split(' ').splice(-1, 3);
        let addressCSZ = obj.Address.trim().split(' ').slice(-3);
        const ndc = obj.NDCImage.split('^')[3];

        // let strengtharray = obj.Strength.replace(/\'/g, '').split(/(\d+)/).filter(Boolean);

        async function insertRow() {
          const deaClassificationId = await getClassificationId(ndc);
          let classificationId = deaClassificationId === 2 ? 2
            : deaClassificationId === 3
            || deaClassificationId === 4
            || deaClassificationId === 5 ? 4 : 6;

          const rxNumber = 'rxId' + classificationId;
          //
          const rxId = await patchCounters(rxNumber);
          console.log(rxId);

          let patient = {
            name: {
              firstName: patientName[0] === null ? ' ' : patientName[0],
              lastName: patientName[1] === null ? ' ' : patientName[1],
            },
            contact: {
              phone: obj.Phone,
            },
            address: {
              line1: addressLine1,
              city: addressCSZ[0],
              state: addressCSZ[1],
              zipCode: addressCSZ[2],
            },
            details: {
              gender: obj.Gender === 'F' ? 'Female' : obj.Gender === 'M' ? 'Male' : ' ',
              dateOfBirth: obj.DOB,
              age: obj.Age,
              note: obj.CounselNotes,
            }
          };

          let prescriber = {
            npi: obj.NPI,
            name: {
              firstName: obj.Presriber.substring(0, obj.Presriber.indexOf(' ')),
              lastName: obj.Presriber.substring(obj.Presriber.indexOf(' ') + 1)
            },
            deaNumber: obj.DEA,
          };

          let patientId = await savePatient(patient);

          console.log('patient', patientId);

          let prescriberId = await savePrescriber(prescriber);

          console.log('prescriber', prescriberId);

          let productId = await getProductName(ndc);

          console.log('productId', productId);

          let images = await request2.query(`select * from [dbo].[RecievedRxImages] where [RecievedRxID] = ${row.ReceiveRxID}`);
          //   // .then(result=>console.log(result.recordset))
          //   // .catch(err=>console.log(err));
          //
          //   console.log(images.recordset);
          //
          let notes = await request3.query(`select * from [dbo].[RecievedRxNotes] where [RecievedRxID] = ${row.ReceiveRxID}`);
          //   // .then(result=>console.log(result.recordset))
          //   // .catch(err=>console.log(err));
          //
          //   console.log(notes.recordset);
          //
          // console.log(images.recordset.find(image=>image.ImgNo ===1));
          const rx = {
            rxId: rxId,
            rxType: 'external',
            patient_id: String(patientId),
            prescriber_id: String(prescriberId),
            pharmacy_id: context.data.pharmacyId,
            product_id: ndc,
            productName: String(productId),
            image: (images.recordset.find(image => image.ImgNo === 1) || {})['ImgData'],

            refills: {
              fills: [{
                sig: {
                  description: obj.Instruction,
                },
                orderDate: obj.WrittenDate,
                quantityDispensed: obj.Qty,
                daysSupply: obj.DaysSupply,
                user: {
                  username: obj.UpdatedByUser,
                  lastAction: obj.LastAction,
                },
                reject: {
                  comment: obj.RejectComment,
                  reasonType: obj.RejectReason,
                },
                rxImage: {
                  drug: (images.recordset.find(image => image.ImgNo === 2) || {})['ImgData'],
                  label: (images.recordset.find(image => image.ImgNo === 3) || {})['ImgData'],
                  optional: (images.recordset.find(image => image.ImgNo === 4) || {})['ImgData'],
                },
                notes: {
                  comment: (notes.recordset.find(notes => notes.NotesType === 'C') || {})['Notes'],
                  note: (notes.recordset.find(notes => notes.NotesType === 'N') || {})['Notes'],
                },
                status:
                  obj.Status === 5 ? 'Deleted'
                    : obj.Status === 6 ? 'Restocked'
                    : obj.Status === 8 ? 'Transfer In'
                      : obj.Status === 9 ? 'Fax Sent to Tech' : '',
                verificationStatus:
                  obj.Status === 0 ? 'Draft'
                    : obj.Status === 1 ? 'Pending'
                    : obj.Status === 2 ? 'Approved'
                      : obj.Status === 3 ? 'Release'
                        : obj.Status === 4 ? 'Rejected'
                          : obj.Status === 7 ? 'Verified by Patient' : ''
              }],
              total: obj.Refills,
            },
            hl7: {
              hl7String: obj.ReceiveRxString,
            },
            // receivedRx: {
            // receivedRxId: obj.ReceiveRxID,
            // receivedRxString: obj.ReceiveRxString,
            // priority: obj.Priority,
            // partial: obj.Partial,
            // onHold: obj.OnHold.toString(),
            // partialDetail: obj.PartialDetail.toString(),
            // isLockedForEdit: obj.IsLockedForEdit,
            // lockedBy: obj.LockedBy,
            // lockDate: obj.LockDate,
            // storeID: obj.StoreID,
            // storeName: obj.StoreName.toString(),
            // createdDate: obj.CreatedDate,
            // updatedDate: obj.UpdatedDate
            // }
          };

          // console.log(rx);

          let rx_id = await saveRx(rx);

          // console.log('rxId', rx_id);
          console.log(++count);


        }

        insertRow().catch(err => console.log(err));

      });

      request.on('error', err => {
        // May be emitted multiple times
      });

      request.on('done', result => {
        // Always emitted as the last one
        console.log('done');
        // sql.close();

      });
    });

    sql.on('error', err => {
      // ... error handler
    });


    // let obj = {
    //   ReceiveRxID: 1691,
    //   ReceiveRxString:
    //     `\u000bMSH|^~/&|MMS^||SCRIPTPRO||||| |||\rPID|||319||REAL^PATIENT^||11/5/1986 12:00:00 AM|F|N||PO BOX 208^^CHAMA^NM^87520||5757562270||||||||||||||||MMS254|\rPV1|
    //     ||||||||||||||||||||||||||||||||||||||||||||||1|2.10||\rORC|||61120||||^^^12/12/2017 12:00:00 AM^||12/13/2017 12:00:00 AM^|||Tessa^Schwering^|5057274500||||10|||12/13/20
    //     18|||\rRXE|^^^^|^^^00555077902^MedroxyPROGESTERone^005550779PROVERA^MEDROXYPROGESTERONE ACETA^^^|||||TAKE 1 TABLET (10 MG TOTAL) BY MOUTH 1 (ONE) TIME EACH DAY FOR FOR 1
    //     0 DAYS DAYS.^|||10.000|TAB|||APO^^^^^||NO REFILLS|0|0|||^||||10MG|||0|||Generic for 005550779PROVERA|||\rRXD||||||||||||||||||||TEVE PHARM|^||||\r\u001c\r`,
    //   PatientName: 'REAL PATIENT',
    //   Address: 'PO BOX 208  CHAMA NM 87520',
    //   Phone: '5757562270',
    //   DOB: '1986-11-05T00:00:00.000Z',
    //   Gender: 'F',
    //   Age: 31,
    //   DrugName: 'MedroxyPROGESTERone',
    //   Instruction: 'TAKE 1 TABLET (10 MG TOTAL) BY MOUTH 1 (ONE) TIME ',
    //   Rxnumber: '61189',
    //   NDCImage: '^^^00555077902^MedroxyPROGESTERone^005550779PROVERA^MEDROXYPROGESTERONE ACETA^^^',
    //   Strength: '10MG',
    //   Qty: 10,
    //   Refills: 0,
    //   WrittenDate: '2017-12-13T00:00:00.000Z',
    //   ExpiryDate: '2017-12-12T00:00:00.000Z',
    //   DaysSupply: 10,
    //   Presriber: 'Tessa Ract',
    //   NPI: '',
    //   DEA: '',
    //   Status: 7,
    //   RejectComment: 'X',
    //   RejectReason: 0,
    //   CounselNotes: 'X',
    //   CreatedDate: '2017-12-13T22:41:54.018Z',
    //   UpdatedDate: '2017-12-13T22:41:54.018Z',
    //   NotesType: '',
    //   LastUpdatedBy: 0,
    //   UpdatedByUser: 'PATIENT',
    //   Priority: 'N',
    //   Partial: 'N',
    //   OnHold: 'N',
    //   LastAction: 'VerifiedByPatient',
    //   PartialDetail: '',
    //   IsLockedForEdit: 0,
    //   LockedBy: 49,
    //   LockDate: '2017-12-15T00:31:13.493Z',
    //   StoreID: 1,
    //   StoreName: 'Chama, NM'
    // };
    //
    //


    return context;
  };
};
