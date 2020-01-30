// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    if(context.params.query.getId === true) {
      console.log('context:',context.id);
      let res = await context.app.service('surescript').find({
          query: {
            '_id':context.id
          }
        });
      let obj = JSON.parse(res['data'][0].message);

      let druglistEDI = {
        packageId: '',
        UPC: null,
        NDC11: ((obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('drugcoded')) ? obj.message.body[0].newrx[0].medicationprescribed[0].drugcoded[0].productcode[0] : '',
        UnitPrice: null,
        AWPUnitPrice: null,
        RESUnitPrice: null,
        DrugName: obj.message.body[0].newrx[0].medicationprescribed[0].drugdescription[0],
        Brand: '',
        VendorProductNumber: null,
        Invoiced: 'N',
        DrugType: '',
        orderedQuantity: null,
        unitOfMeasure: 'EA',
        dirUnitPrice: null,
        deaClassificationId: 6,
        packageSize: null,
        productId: ((obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('drugcoded')) ? obj.message.body[0].newrx[0].medicationprescribed[0].drugcoded[0].productcode[0] : ''
      }

      let patient = {
        name: {
          firstName: ((obj.message.body[0].newrx[0].patient[0]).hasOwnProperty('name'))?
            (((obj.message.body[0].newrx[0].patient[0].name[0]).hasOwnProperty('firstname')) ?
              obj.message.body[0].newrx[0].patient[0].name[0].firstname[0] : ''):'',
          middleName: ((obj.message.body[0].newrx[0].patient[0]).hasOwnProperty('name'))?
            (((obj.message.body[0].newrx[0].patient[0].name[0]).hasOwnProperty('middlename')) ?
              obj.message.body[0].newrx[0].patient[0].name[0].middlename[0] : ''):'',
          lastName: ((obj.message.body[0].newrx[0].patient[0]).hasOwnProperty('name'))?
            (((obj.message.body[0].newrx[0].patient[0].name[0]).hasOwnProperty('lastname')) ?
              obj.message.body[0].newrx[0].patient[0].name[0].lastname[0] : ''):'',
        },
        contact: {
          phone: ((obj.message.body[0].newrx[0].patient[0]).hasOwnProperty('communicationnumbers'))?
            (((obj.message.body[0].newrx[0].patient[0].communicationnumbers[0]).hasOwnProperty('communication')) ?
              ((obj.message.body[0].newrx[0].patient[0].communicationnumbers[0].communication[0].qualifier[0] === 'TE')?
                obj.message.body[0].newrx[0].patient[0].communicationnumbers[0].communication[0].number[0]: ''): ''):'',
          email: ((obj.message.body[0].newrx[0].patient[0]).hasOwnProperty('communicationnumbers'))?
            (((obj.message.body[0].newrx[0].patient[0].communicationnumbers[0]).hasOwnProperty('communication')) ?
              ((obj.message.body[0].newrx[0].patient[0].communicationnumbers[0].communication[0].qualifier[0] === 'EM')?
                obj.message.body[0].newrx[0].patient[0].communicationnumbers[0].communication[0].number[0]: ''): ''):'',
          homePhone: '',
        },
        address: {
          patientResidence: '',
          line1: ((obj.message.body[0].newrx[0].patient[0]).hasOwnProperty('address'))?
            (((obj.message.body[0].newrx[0].patient[0].address[0]).hasOwnProperty('addressline1')) ?
              obj.message.body[0].newrx[0].patient[0].address[0].addressline1[0] : ''):'',
          line2: ((obj.message.body[0].newrx[0].patient[0]).hasOwnProperty('address'))?
            (((obj.message.body[0].newrx[0].patient[0].address[0]).hasOwnProperty('addressline2')) ?
              obj.message.body[0].newrx[0].patient[0].address[0].addressline2[0] : ''):'',
          city: ((obj.message.body[0].newrx[0].patient[0]).hasOwnProperty('address'))?
            (((obj.message.body[0].newrx[0].patient[0].address[0]).hasOwnProperty('city')) ?
              obj.message.body[0].newrx[0].patient[0].address[0].city[0] : ''):'',
          state: ((obj.message.body[0].newrx[0].patient[0]).hasOwnProperty('address'))?
            (((obj.message.body[0].newrx[0].patient[0].address[0]).hasOwnProperty('state')) ?
              obj.message.body[0].newrx[0].patient[0].address[0].state[0] : ''):'',
          zipCode: ((obj.message.body[0].newrx[0].patient[0]).hasOwnProperty('address'))?
            (((obj.message.body[0].newrx[0].patient[0].address[0]).hasOwnProperty('zipcode')) ?
              obj.message.body[0].newrx[0].patient[0].address[0].zipcode[0] : ''):'',
          country: ((obj.message.body[0].newrx[0].patient[0]).hasOwnProperty('address'))?
            (((obj.message.body[0].newrx[0].patient[0].address[0]).hasOwnProperty('country')) ?
              obj.message.body[0].newrx[0].patient[0].address[0].country[0] : ''):'',
        },
        idCard: [{
          idType: ((obj.message.body[0].newrx[0].patient[0]).hasOwnProperty('identification'))?
            (((obj.message.body[0].newrx[0].patient[0].identification[0]).hasOwnProperty('payerid')) ? 'Payer ID':
              (((obj.message.body[0].newrx[0].patient[0].identification[0]).hasOwnProperty('fileid')) ? 'File ID': '')): '',
          number: ((obj.message.body[0].newrx[0].patient[0]).hasOwnProperty('identification'))?
            (((obj.message.body[0].newrx[0].patient[0].identification[0]).hasOwnProperty('payerid')) ?
              obj.message.body[0].newrx[0].patient[0].identification[0].payerid[0] : ''):'',
        }],
        details: {
          gender: ((obj.message.body[0].newrx[0].patient[0]).hasOwnProperty('gender'))?
            (obj.message.body[0].newrx[0].patient[0].gender[0] === 'F' ?
              'Female' : obj.message.body[0].newrx[0].patient[0].gender[0] === 'M' ?
                'Male' : ' '): ' ',
          dateOfBirth: ((obj.message.body[0].newrx[0].patient[0]).hasOwnProperty('dateofbirth'))?
            (((obj.message.body[0].newrx[0].patient[0].dateofbirth[0]).hasOwnProperty('date')) ?
              obj.message.body[0].newrx[0].patient[0].dateofbirth[0].date[0] : '') : '',
          hippaSignature: '',
          note: '',
        },
        pharmacy: {
          name: ((obj.message.body[0].newrx[0]).hasOwnProperty('pharmacy'))?
            (((obj.message.body[0].newrx[0].pharmacy[0]).hasOwnProperty('storename'))?
              obj.message.body[0].newrx[0].pharmacy[0].storename[0] : ''):'',
          employerId: [],
        },
        insurance: [{
          insuranceCode: '',
          homePlan: '',
          eligibilityClarificationCode: '',
          groupNumber: ((obj.message.body[0].newrx[0]).hasOwnProperty('benefitscoordination'))?
            (((obj.message.body[0].newrx[0].benefitscoordination[0]).hasOwnProperty('groupid'))?
              obj.message.body[0].newrx[0].benefitscoordination[0].groupid[0] : '') : '',
          personCode: '',
          relationship: ((obj.message.body[0].newrx[0].patient[0]).hasOwnProperty('patientrelationship'))?
            obj.message.body[0].newrx[0].patient[0].patientrelationship[0]:'',
          medigapId: '',
          medicaidIndicator: '',
          providerAcceptAssignmentIndicator: '',
          cmsPartdqualFacility: '',
          medicaidId: '',
          medicaidAgencyNumber: '',
          insuranceType: '',
          versionOrReleaseNumber: '',
          insuranceName: '',
          processorControlNumber: '',
          binNumber: ((obj.message.body[0].newrx[0]).hasOwnProperty('benefitscoordination'))?
            (((obj.message.body[0].newrx[0].benefitscoordination[0]).hasOwnProperty('payeridentification'))?
              (((obj.message.body[0].newrx[0].benefitscoordination[0].payeridentification[1]).hasOwnProperty('binlocationnumber'))?
                obj.message.body[0].newrx[0].benefitscoordination[0].payeridentification[1].binlocationnumber[0]:''):''):'',
          serviceProviderId: '',
          dateOfService: '',
          softwareVendorOrCertificationId: '',
          planId: '',
        }],
      };

      let prescriber = {
        npi: ((obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('identification'))?
          (((obj.message.body[0].newrx[0].prescriber[0].identification[0]).hasOwnProperty('npi'))?
            obj.message.body[0].newrx[0].prescriber[0].identification[0].npi[0]:''):'',
        name: {
          firstName: ((obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('name'))?
            (((obj.message.body[0].newrx[0].prescriber[0].name[0]).hasOwnProperty('firstname'))?
              obj.message.body[0].newrx[0].prescriber[0].name[0].firstname[0]:''):'',
          lastName: ((obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('name'))?
            (((obj.message.body[0].newrx[0].prescriber[0].name[0]).hasOwnProperty('lastname'))?
              obj.message.body[0].newrx[0].prescriber[0].name[0].lastname[0]:''):'',
        },
        address: {
          line1: ((obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('address'))?
            (((obj.message.body[0].newrx[0].prescriber[0].address[0]).hasOwnProperty('addressline1')) ?
              obj.message.body[0].newrx[0].prescriber[0].address[0].addressline1[0] : '') : '',
          line2: ((obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('address'))?
            (((obj.message.body[0].newrx[0].prescriber[0].address[0]).hasOwnProperty('addressline2')) ?
              obj.message.body[0].newrx[0].prescriber[0].address[0].addressline2[0] : '') : '',
          city: ((obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('address'))?
            (((obj.message.body[0].newrx[0].prescriber[0].address[0]).hasOwnProperty('city')) ?
              obj.message.body[0].newrx[0].prescriber[0].address[0].city[0] : '') : '',
          state: ((obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('address'))?
            (((obj.message.body[0].newrx[0].prescriber[0].address[0]).hasOwnProperty('state')) ?
              obj.message.body[0].newrx[0].prescriber[0].address[0].state[0] : '') : '',
          zipcode: ((obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('address'))?
            (((obj.message.body[0].newrx[0].prescriber[0].address[0]).hasOwnProperty('zipcode')) ?
              obj.message.body[0].newrx[0].prescriber[0].address[0].zipcode[0] : '') : '',
        },
        contact: {
          phone: ((obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('communicationnumbers'))?
            (((obj.message.body[0].newrx[0].prescriber[0].communicationnumbers[0]).hasOwnProperty('communication'))?
              ((obj.message.body[0].newrx[0].prescriber[0].communicationnumbers[0].communication[0].qualifier[0] === 'TE')?
                obj.message.body[0].newrx[0].prescriber[0].communicationnumbers[0].communication[0].number[0]: ''):''):'',
          faxNumber: ((obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('communicationnumbers'))?
            (((obj.message.body[0].newrx[0].prescriber[0].communicationnumbers[0]).hasOwnProperty('communication'))?
              ((obj.message.body[0].newrx[0].prescriber[0].communicationnumbers[0].communication[0].qualifier[0] === 'FX')?
                obj.message.body[0].newrx[0].prescriber[0].communicationnumbers[0].communication[0].number[0]: ''):''):'',
          email: ((obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('communicationnumbers'))?
            (((obj.message.body[0].newrx[0].prescriber[0].communicationnumbers[0]).hasOwnProperty('communication'))?
              ((obj.message.body[0].newrx[0].prescriber[0].communicationnumbers[0].communication[0].qualifier[0] === 'EM')?
                obj.message.body[0].newrx[0].prescriber[0].communicationnumbers[0].communication[0].number[0]: ''):''):'',
        },
        license: {
          licenseType: ((obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('identification'))?
            (((obj.message.body[0].newrx[0].prescriber[0].identification[0]).hasOwnProperty('statelicensenumber'))?
              'State License Number':''):'',
          licensenumber: ((obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('identification'))?
            (((obj.message.body[0].newrx[0].prescriber[0].identification[0]).hasOwnProperty('statelicensenumber'))?
              obj.message.body[0].newrx[0].prescriber[0].identification[0].statelicensenumber[0]:''):'',
        },
        deaNumber: ((obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('identification'))?
          (((obj.message.body[0].newrx[0].prescriber[0].identification[0]).hasOwnProperty('deanumber'))?
            obj.message.body[0].newrx[0].prescriber[0].identification[0].deanumber[0]:''):'',
        facility: '',
        upinNumber: ((obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('identification'))?
          (((obj.message.body[0].newrx[0].prescriber[0].identification[0]).hasOwnProperty('upin'))?
            obj.message.body[0].newrx[0].prescriber[0].identification[0].upin[0]:null):null,
        spi: ((obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('identification'))?
          (((obj.message.body[0].newrx[0].prescriber[0].identification[0]).hasOwnProperty('spi'))?
            obj.message.body[0].newrx[0].prescriber[0].identification[0].spi[0]:''):'',
        insuranceRestriction: '',
        medicalIdProviderNumber: null,
      };

      let ndc =((obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('drugcoded')) ? (obj.message.body[0].newrx[0].medicationprescribed[0].drugcoded[0].productcode[0]).replace(/^0+/, '') : '';
      console.log('ndc',ndc);

      function savePatient(patient) {
        return new Promise((resolve, reject) => {
          context.app.service('patient').find({
            query: {
              // 'name.firstName': patient.name.firstName,
              'name.lastName': patient.name.lastName,
              'details.dateOfBirth': patient.details.dateOfBirth
            }
          }).then(result => {
            if (result.total !== 0) {
              resolve(result.data[0]._id);
            }
            else {
              context.app.service('patient').create(patient, context.params)
                .then(result => {
                  resolve(result._id);
                }).catch(err => reject(err));
            }
          }).catch(err => reject(err));
        });
      }

      function savePharmacy(ncpdpid) {
        return new Promise((resolve, reject) => {
          context.app.service('pharmacy').find({
            query: {
              'ncpdpId': ncpdpid
            }
          }).then(result => {
            if (result.total !== 0) {
              resolve(result.data[0]._id);
            }
          }).catch(err => reject(err));
      });
      }

      function savePrescriber(prescriber) {
        return new Promise((resolve, reject) => {
          context.app.service('prescriber').find({
            query: {
              // 'name.firstName': prescriber.name.firstName,
              'name.lastName': prescriber.name.lastName,
            }
          }).then(result => {
            if (result.total !== 0) {
              resolve(result.data[0]._id);
            }
            else {
              context.app.service('prescriber').create(prescriber, context.params).then(result => {
                resolve(result._id);
              }).catch(err => reject(err));
            }
          }).catch(err => reject(err));
        });
      }

      function getProductName(id) {
        return new Promise((resolve, reject) => {
          context.app.service('druglist-edi').find({
            query: {
              $or: [{'NDC11': ((obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('drugcoded')) ? obj.message.body[0].newrx[0].medicationprescribed[0].drugcoded[0].productcode[0] : ''},
                {'DrugName': ((obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('drugdescription')) ? obj.message.body[0].newrx[0].medicationprescribed[0].drugdescription[0] : ''}],
              $limit: false
            }
          }).then(result => {
            console.log('res product', result.total);
            if (result.total !== 0) {
              console.log('product obj id:', result['data'][0]._id);
              resolve(result['data'][0]._id);
            } else {
              context.app.service('package').find({
                query: {
                  'NDC11': id,
                  'type':'ndc'
                }
              }).then(result => {
                if (result['length'] !== 0) {
                  resolve(result[0].gsdd5Product[0]._id);
                } else {
                  resolve('');
                  // context.app.service('druglist-edi').create(druglistEDI,{
                  //   query: {
                  //     inventory: true
                  //   }
                  // }).then(result => {
                  //     console.log('prod id', result);
                  //     resolve(result._id);
                  //   }).catch(err => reject(err));
                }
              });
            }
          }).catch(err => reject(err));


          // context.app.service('package').find({
          //   query: {
          //     'NDC11': id,
          //     'type':'ndc'
          //   }
          // }).then(result => {
          //   if(result['length'] !== 0) {
          //     resolve(result[0].gsdd5Product[0]._id);
          //   } else {
          //     context.app.service('druglist-edi').find({
          //       query: {
          //         $or: [{'NDC11': ((obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('drugcoded')) ? obj.message.body[0].newrx[0].medicationprescribed[0].drugcoded[0].productcode[0] : ''},
          //           {'DrugName': ((obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('drugdescription')) ? obj.message.body[0].newrx[0].medicationprescribed[0].drugdescription[0] : ''}],
          //         $limit: false
          //       }
          //     }).then(result =>{
          //       console.log('res product', result.total);
          //       if(result.total !== 0) {
          //         console.log('product obj id:',result['data'][0]._id);
          //         resolve(result['data'][0]._id);
          //       } else {
          //         resolve('');
          //         // context.app.service('druglist-edi').create(druglistEDI,{
          //         //   query: {
          //         //     inventory: true
          //         //   }
          //         // }).then(result => {
          //         //     console.log('prod id', result);
          //         //     resolve(result._id);
          //         //   }).catch(err => reject(err));
          //       }
          //     });
          //   }
          // }).catch(err => reject(err));
        });
      }

      function getClassificationId(id) {
        return new Promise((resolve, reject) => {
          context.app.service('package').find({
            query: {
              'NDC11': id,
              'type':'ndc'
            }
          }).then(result => {
            if(result['length'] !== 0) {
              resolve(result[0].gsdd5Product[0].DEAClassificationID);
            } else {
              console.log('len:',result['length']);
              // Considering the default for NonRx DEAClassfiID as 6.
              resolve(6);
            }
          }).catch(err => reject(err));
        });
      }

      function awpFromGsdd(id) {
        return new Promise((resolve, reject) => {
          context.app.service('package').find({
            query: {
              'NDC11': id,
              'type':'ndc'
            }
          }).then(result => {
            if(result['length'] !== 0) {
              if (result[0].gsdd5prices[0]) {
                if (result[0].gsdd5prices[1]) {
                  resolve(result[0].gsdd5prices[1].UnitPrice);
                  // this.wac = result[0].gsdd5prices[0].UnitPrice;
                } else {
                  resolve(result[0].gsdd5prices[0].UnitPrice);
                }
              } else {
                resolve(0);
              }
            } else {
              // Considering the default for NonRx AWP as 0.
              resolve(0);
            }
          }).catch(err => reject(err));
        });
      }

      const deaClassificationId = await getClassificationId(ndc);

      let classificationId = deaClassificationId === 2 ? 2
        : deaClassificationId === 3
        || deaClassificationId === 4
        || deaClassificationId === 5 ? 4 : 6;

      const rxNumber = 'rxId' + classificationId;

      const rxId = await patchCounters(rxNumber);

      function patchCounters(rxNumber) {
        return new Promise((resolve, reject) => {
          context.app.service('counters').Model.findOneAndUpdate(null, {
            $inc: {[rxNumber]: 1}
          }, {new: true}).then(result => {
            resolve(result[rxNumber]);
          })
            .catch(err => reject(err));
        });
      }

      let awpFromGsdd5 = await awpFromGsdd(ndc);

      let patientId = await savePatient(patient);
      console.log('patientId:',patientId);

      let prescriberId = await savePrescriber(prescriber);
      console.log('prescriberId:',prescriberId);

      let pharmacyId = await savePharmacy(obj.message.body[0].newrx[0].pharmacy[0].identification[0].ncpdpid[0]);
      console.log('pharmacyId', pharmacyId);

      let productId = await getProductName(ndc);
      console.log('productId:',productId);

      let rx = {
        _id: '',
        rxId: rxId,
        isPriorty: false,
        rxType: 'external',
        patient: patient,
        prescriber: prescriber,
        patient_id: patientId,
        productDetails: {
          productName: productId,
          name: obj.message.body[0].newrx[0].medicationprescribed[0].drugdescription[0],
          DEAClass: classificationId
        },
        prescriber_id: prescriberId,
        prescriberLocationName: '',
        pharmacy_id: pharmacyId,
        product_id: ndc,
        digitalSignature: ((obj.message.header[0]).hasOwnProperty('digitalsignature'))?
          (((obj.message.header[0].digitalsignature[0]).hasOwnProperty('signaturevalue'))?
            [obj.message.header[0].digitalsignature[0].signaturevalue[0]]:['']):[''],
        digitalSignVerification: (obj.message.body[0].newrx[0].medicationprescribed[0].hasOwnProperty('drugcoveragestatuscode')) ?
          ((obj.message.body[0].newrx[0].medicationprescribed[0].drugcoveragestatuscode[0] === 'SI') ? 'Yes' : 'No') : 'No',
        wetSignature: '',
        refillTrackerQty: null,
        refillTrackerDescription: '',
        image: '',
        refills: {
          fills: [{
            daw: '',
            unitOfMeasure: null,
            rxOriginCode: 'E-Prescription',
            iou: 0,
            billTo: 'CASH',
            sig: {
              code: '',
              description: ((obj.message.body[0].newrx[0]).hasOwnProperty('medicationprescribed'))?
                (((obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('directions'))?
                  obj.message.body[0].newrx[0].medicationprescribed[0].directions[0]:''):'',
            },
            number: ((obj.message.body[0].newrx[0]).hasOwnProperty('medicationprescribed'))?
              (((obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('substitutions'))?
                obj.message.body[0].newrx[0].medicationprescribed[0].substitutions[0]:''):'',
            quantityDispensed: ((obj.message.body[0].newrx[0]).hasOwnProperty('medicationprescribed'))?
              (((obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('quantity'))?
                ((obj.message.body[0].newrx[0].medicationprescribed[0].quantity[0]).hasOwnProperty('value') ?
                  obj.message.body[0].newrx[0].medicationprescribed[0].quantity[0].value[0]: ''):''):'',
            daysSupply: ((obj.message.body[0].newrx[0]).hasOwnProperty('medicationprescribed'))?
              (((obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('dayssupply'))?
                obj.message.body[0].newrx[0].medicationprescribed[0].dayssupply[0]:0):0,
            usualAndCustomerCharge: null,
            rxImage: {
              drug: '',
              label: '',
              optional: '',
            },
            user: {
              username: '',
              lastAction: '',
              dispensingFee: 5,
            },
            billing: [{
              billingType: '',
              insurance: {
                planId: '',
                name: '',
                insurancePaid: null,
                ingredientCostPaid: null,
                dispensingFeePaid: null,
                flatSalesTax: null,
                salesTaxRate: null,
                SalesTaxBasis: null,
                percentOfSalesTax: null,
              },

              acqPrice: 0,
              awpPrice: awpFromGsdd5,
            }],
            reject: {
              comment: '',
              reasonType: '',
            },
            status: '',
            deliveryMethod: '',
            notes: {
              comment: '',
              note: ((obj.message.body[0].newrx[0]).hasOwnProperty('medicationprescribed'))? (
                (obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('note')?
                  obj.message.body[0].newrx[0].medicationprescribed[0].note[0]: ''):'',
            },
            orderedQuantity: ((obj.message.body[0].newrx[0]).hasOwnProperty('medicationprescribed'))?
              (((obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('quantity'))?
                ((obj.message.body[0].newrx[0].medicationprescribed[0].quantity[0]).hasOwnProperty('codelistqualifier') ?
                  obj.message.body[0].newrx[0].medicationprescribed[0].quantity[0].codelistqualifier[0]: ''):''):'',
            verificationStatus: '',
            fillDate: null
          }],
          orderDate: ((obj.message.body[0].newrx[0]).hasOwnProperty('medicationprescribed'))?
            (((obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('writtendate'))?
              ((obj.message.body[0].newrx[0].medicationprescribed[0].writtendate[0]).hasOwnProperty('date') ?
                obj.message.body[0].newrx[0].medicationprescribed[0].writtendate[0].date[0]: ''):''):'',
          total: ((obj.message.body[0].newrx[0]).hasOwnProperty('medicationprescribed'))?
            (((obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('refills'))?
              ((obj.message.body[0].newrx[0].medicationprescribed[0].refills[0]).hasOwnProperty('value') ?
                obj.message.body[0].newrx[0].medicationprescribed[0].refills[0].value[0]: ''):''):'',
        }
      };

      function saveRx(rx) {
        return new Promise((resolve, reject) => {
          context.app.service('rx').create(rx).then(result => {
                resolve(result._id);
              }).catch(err => reject(err));
            });
      }

      let rx_id = await saveRx(rx);
      console.log('rx_id:',rx_id);

      context.result = rx_id;
    }

    return context;
  };
};
