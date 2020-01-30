const hl7parser = require('hl7parser');

const wtf8 = require('wtf-8');

let gender;


// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    // console.log('hl7 receive',context.data);
    function savePatient(patient) {
      // console.log(patient)
      return new Promise((resolve, reject) => {
        context.app.service('patient').find({
          query: {
            'name.firstName': patient.name.firstName,
            'name.lastName': patient.name.lastName,
            'details.dateOfBirth': patient.details.dateOfBirth
          }
        }).then(result => {
          if (result.total !== 0) {
            resolve(result.data[0]._id);
          } else {
            context.app.service('patient').create(patient, context.params)
              .then(result => {
                resolve(result._id);
              }).catch(err => reject(err));
          }
        }).catch(err => reject(err));
      });
    }
    const crypto = require('crypto');
    function createDigitalSign(rxId, prescriberNPI) {
      return new Promise((resolve, reject)=>{
        try {
          const hash = crypto.createHmac('sha256', context.app.settings.digitalSignKey)
            .update(rxId + '' + prescriberNPI)
            .digest('hex');
          resolve(hash);
          // context.data.digitalSignature.push(hash);
        } catch (err) {
        }
      })
    }

    function savePrescriber(prescriber) {
      return new Promise((resolve, reject) => {
        context.app.service('prescriber').find({
          query: {
            'name.firstName': prescriber.name.firstName,
            'name.lastName': prescriber.name.lastName,
          }
        }).then(result => {
          if (result.total !== 0) {
            resolve(result.data[0]._id);
          } else {
            context.app.service('prescriber').create(prescriber, context.params).then(result => {
              resolve(result._id);
            }).catch(err => reject(err));
          }
        }).catch(err => reject(err));
      });
    }

    function saveRx(rx, fill) {
      return new Promise((resolve, reject) => {
        context.app.service('rx').Model.findOne({
          'rxId': (rx.rxId)
        }).then(result => {

          if (result) {
            let fills = result.refills.fills;
            // console.log(fills.length);
            for (let i = fills.length; i <= fill.number; i++) {
              if (i === Number(fill.number)) {
                fills.push(fill);
              } else {
                fills.push({
                  daw: null,
                  unitOfMeasure: '',
                  rxOriginCode: '',
                  iou: 0,
                  billTo: 'CASH',
                  sig: {
                    code: '',
                    description: null,
                  },
                  number: null,
                  quantityDispensed: 0,
                  daysSupply: 0,
                  usualAndCustomerCharge: 0,
                  rxImage: {
                    drug: '',
                    label: '',
                    optional: '',
                  },
                  user: {
                    username: '',
                    lastAction: '',
                    dispensingFee: 0,
                  },
                  billing: [{
                    billingType: '',
                    insurance: {
                      planId: '',
                      name: '',
                      insurancePaid: 0,
                      ingredientCostPaid: 0,
                      dispensingFeePaid: 0,
                      flatSalesTax: 0,
                      salesTaxRate: 0,
                      SalesTaxBasis: 0,
                      percentOfSalesTax: 0,
                    },
                    patientPaid: 0,
                    acqPrice: 0,
                    awpPrice: 0,
                    billed: 0,
                    totalPaid: 0,
                    profitMargin: 0,
                  }],
                  package: {
                    package_priceId: 0,
                  },
                  amount: {
                    cashPrice: 0,
                    price: 0,
                  },
                  reject: {
                    comment: '',
                    reasonType: '',
                  },
                  status: null,
                  deliveryMethod: '',
                  orderedQuantity: null,
                  verificationStatus: null,
                  fillDate: null,
                });
              }
            }

            rx.refills.fills = fills;


            // result.refills.fills[message.get('RXE.17').toString()] = rx.refills.fills[0];
            context.app.service('rx').patch(result._id, rx, context.params);
          } else {
            let fills = [];
            for (let i = 0; i <= fill.number; i++) {
              if (i === Number(fill.number)) {
                fills.push(fill);
              } else {
                fills.push({
                  daw: null,
                  unitOfMeasure: '',
                  rxOriginCode: '',
                  iou: 0,
                  billTo: 'CASH',
                  sig: {
                    code: '',
                    description: null,
                  },
                  number: null,
                  quantityDispensed: 0,
                  daysSupply: 0,
                  usualAndCustomerCharge: 0,
                  rxImage: {
                    drug: '',
                    label: '',
                    optional: '',
                  },
                  user: {
                    username: '',
                    lastAction: '',
                    dispensingFee: 0,
                  },
                  billing: {
                    billingType: '',
                    insurance: {
                      planId: '',
                      name: '',
                      insurancePaid: 0,
                      ingredientCostPaid: 0,
                      dispensingFeePaid: 0,
                      flatSalesTax: 0,
                      salesTaxRate: 0,
                      SalesTaxBasis: 0,
                      percentOfSalesTax: 0,
                    },
                    patientPaid: 0,
                    acqPrice: 0,
                    awpPrice: 0,
                    billed: 0,
                    totalPaid: 0,
                    profitMargin: 0,
                  },
                  package: {
                    package_priceId: 0,
                  },
                  amount: {
                    cashPrice: 0,
                    price: 0,
                  },
                  reject: {
                    comment: '',
                    reasonType: '',
                  },
                  status: null,
                  deliveryMethod: '',
                  orderedQuantity: null,
                  verificationStatus: null,
                  fillDate: null,
                });
              }
            }

            rx.refills.fills = fills;

            // console.log(rx);

            context.app.service('rx').create(rx, context.params).then(result => {
              // console.log('rxresult', result);
              resolve(result._id);
            }).catch(err => reject(err));
          }
        }).catch(err => reject(err));
      });
    }


    function getProductName(id) {
      return new Promise((resolve, reject) => {
        context.app.service('package').find({
          query: {
            'NDC11': id,
            'type': 'ndc'
          }
        }).then(result => {
          resolve({
            id: result[0].gsdd5Product[0]._id, name: result[0].gsdd5Product[0].ProductNameShort,
            DEA: result[0].gsdd5Product[0].DEAClassificationID
          });
        }).catch(err => reject(err));
      });
    }


    // function patchCounters(rxNumber) {
    //   return new Promise((resolve, reject) => {
    //     context.app.service('counters').Model.findOneAndUpdate(null, {
    //       $inc: {[rxNumber]: 1}
    //     }, {new: true}).then(result => {
    //       resolve(result[rxNumber]);
    //     })
    //       .catch(err => reject(err));
    //     // context.app.service('counters').patch(null, {
    //     //   $inc: {[rxNumber]: 1}
    //     // }).then(result => {
    //     //   resolve(result[0][rxNumber]);
    //     // });
    //   //
    //   });
    // }


// const test ='MSH|^~/&|MMS^||SCRIPTPRO||||| |||\rPID|||3||TEST^PAYLOAD3^||1/1/2013 12:00:00 AM|M|N||6800 JERICHO TPKE^^SYOSSET^NY^11791||5160000000||||||||||||||||C|\rPV1|||||||||||||||||||||||||||||||||||||||||||||||1|107.24||\rORC|||60005||||^^^10/5/2017 12:00:00 AM^||10/5/2017 12:00:00 AM^|||TEST^DOCTOR^|5164083999||||30|||10/5/2018|||\rRXE|^^^^|^^^16714022504^LOSARTAN  HCTZ^HYZAAR^LOSARTAN POTASSIUM, HYDRO^^^|||||1 BY MOUTH DAILY^|||30.000|TAB|||APO^^^^^||NO REFILLS|0|0|||^||||100-25MG|||0|||Generic for HYZAAR|||\rRXD||||||||||||||||||||NORTHSTAR|^||||';
    // const message = hl7parser.create('MSH|^~/&|MMS^||SCRIPTPRO||||| |||\r' +
    //   'PID|||3||TEST^PAYLOAD3^||1/1/2013 12:00:00 AM|M|N||6800 JERICHO TPKE^^SYOSSET^NY^11791||5160000000||||||||||||||||C|\r' +
    //   'PV1|||||||||||||||||||||||||||||||||||||||||||||||1|107.24||\r' +
    //   'ORC|||60005||||^^^10/5/2017 12:00:00 AM^||10/5/2017 12:00:00 AM^|||TEST^DOCTOR^|5164083999||||30|||10/5/2018|||\r' +
    //   'RXE|^^^^|^^^16714022504^LOSARTAN  HCTZ^HYZAAR^LOSARTAN POTASSIUM, HYDRO^^^|||||1 BY MOUTH DAILY^|||30.000|TAB|||APO^^^^^||NO REFILLS|0|0|||^||||100-25MG|||0|||Generic for HYZAAR|||\r' +
    //   'RXD||||||||||||||||||||NORTHSTAR|^||||');

   // const message = hl7parser.create('MSH|^~/&|MMS^||SCRIPTPRO||||| |||\rPID|||1053||PACHECO^Gloria^||9/11/1966 12:00:00 AM|F|N||PO BOX 232^^Chama^NM^87520||5757568378||||||||||||||||MMS694|\rPV1|||||||||||||||||||||||||||||||||||||||||||||||1|0.00||\rORC|||6594783||||^^^7/24/2018 12:00:00 AM^||8/27/2018 12:00:00 AM^|||Maes^Levi^|5755887252||||30|||8/27/2019|||\rRXE|^^^^|^^^68180098103^LISINOPRIL^PRINIVIL^LISINOPRIL^^^|||||1 TABLET BY MOUTH ONCE A DAY^|||30.000|TAB|||APO^^^^^||REFILLS:4 BY 7/24/2019|5|11|||^||||20MG|||5|||Generic for PRINIVIL|||\rRXD||||||||||||||||||||LUPIN PHAR|^||||');

    // let data = context.data.rx.replace(/\\u000b/gi,'').replace(/\\u001c\\r/gi,'').replace(/"/gi,'').replace(/\\r/,'\\r');//.split(`\u001c\r\u000b`)[1];
    // console.log(`${data.toString()}`);
    // console.log(wtf8.decode(context.data.rx));
    // let data=decodeURIComponent(escape(context.data.rx));


     let data = context.data.rx.replace(/\u000b/gi, '').replace(/\r\u001c\r/gi, '');//.replace(/"/gi,'');//.split(`\u001c\r\u000b`)[1];

    // console.log(context.data.rx.replace(/[^\x00-\x7F]/g, ''));
    // console.log(wtf8.decode(context.data.rx).replace(/[\u{0080}-\u{FFFF}]/gu,''));
    // let data = context.data.rx.replace(/[^\x00-\x7F]/g, '');
    //console.log(JSON.stringify(data));

    // console.log(message.get('ORC.17').toString());


     const message = hl7parser.create(data);
    // console.log(message.get('RXE.2.4').toString());

    // const deaClassificationId = await getClassificationId(message.get('RXE.2.4').toString());

    // let classificationId = deaClassificationId === 2 ? 2
    //   : deaClassificationId === 3
    //   || deaClassificationId === 4
    //   || deaClassificationId === 5 ? 4 : 6;
    //
    // const rxNumber = 'rxId' + classificationId;
    //
    // const rxId = await patchCounters(rxNumber);

    const patient = {
      name: {
        firstName: message.get('PID.5.1').toString(),
        lastName: message.get('PID.5.2').toString(),
      },
      contact: {
        phone: message.get('PID.14').toString(),
        email: message.get('PID.13.4').toString(),
        homePhone: message.get('PID.13.1').toString(),
      },
      address: {
        patientResidence: undefined,
        line1: message.get('PID.11.1').toString(),
        line2: message.get('PID.11.2').toString(),
        city: message.get('PID.11.3').toString(),
        state: message.get('PID.11.4').toString(),
        country: message.get('PID.12').toString(),
        zipCode: message.get('PID.11.5').toString(),
      },

      details: {
        // isPregnant: undefined,
        gender: message.get('PID.8').toString() === 'M' ? 'Male' : message.get('PID.8').toString() === 'F' ? 'Female' : undefined,
        dateOfBirth: message.get('PID.7').toString(),
        // hippaSignature: undefined,
        // note: undefined,
      },
      // insurance: [{
      // insuranceCode: undefined,
      // homePlan: undefined,
      // eligibilityClarificationCode: undefined,
      // groupNumber: undefined,
      // personCode: undefined,
      // relationship: undefined,
      // medigapId: undefined,
      // medicaidIndicator: undefined,
      // providerAcceptAssignmentIndicator: undefined,
      // cmsPartdqualFacility: undefined,
      // medicaidId: undefined,
      // medicaidAgencyNumber: undefined,
      // insuranceType: undefined,
      // versionOrReleaseNumber: undefined,
      // insuranceName: undefined,
      // processorControlNumber: undefined,
      // binNumber: undefined,
      // serviceProviderId: undefined,
      // dateOfService: undefined,
      // softwareVendorOrCertificationId: undefined,
      // planId: undefined,
      // }],

      hl7: {
        pid: {
          setId: message.get('PID.1').toString(),
          patientId: message.get('PID.2').toString(),
          patientIdentifierList: message.get('PID.3').toString(),
          alternatePid: message.get('PID.4').toString(),
          //patientName: message.get('PID.5').toString(),
          mothersMadienName: message.get('PID.6').toString(),
          //dateTimeOfBirth: message.get('PID.7').toString(),
          //administrativeSex: message.get('PID.8').toString(),
          patientAlias: message.get('PID.9').toString(),
          race: message.get('PID.10').toString(),
          //patientAddress: message.get('PID.11').toString(),
          //countryCode: message.get('PID.12').toString(),
          //phoneNumberHome: message.get('PID.13').toString(),
          //phoneNumberBusiness: message.get('PID.14').toString(),
          primaryLanguage: message.get('PID.15').toString(),
          martialStatus: message.get('PID.16').toString(),
          religion: message.get('PID.17').toString(),
          patientAccountNumber: message.get('PID.18').toString(),
          ssnNumber: message.get('PID.19').toString(),
          driversLicenseNumber: message.get('PID.20').toString(),
          mothersIdentifier: message.get('PID.21').toString(),
          ethnicGroup: message.get('PID.22').toString(),
          birthPlace: message.get('PID.23').toString(),
          multipleBirthIndicator: message.get('PID.24').toString(),
          birthOrder: message.get('PID.25').toString(),
          citizenship: message.get('PID.26').toString(),
          veteransMilitaryStatus: message.get('PID.27').toString(),
          nationality: message.get('PID.28').toString(),
          patientDeathDateandTime: message.get('PID.29').toString(),
          patientDeathIndicator: message.get('PID.30').toString(),
          identityUnkwonIndicator: message.get('PID.31').toString(),
          identityReliabilityCode: message.get('PID.32').toString(),
          lastUpdateDateTime: message.get('PID.33').toString(),
          lastUpdateFacility: message.get('PID.34').toString(),
          speciesCode: message.get('PID.35').toString(),
          breedCode: message.get('PID.36').toString(),
          strain: message.get('PID.37').toString(),
          productionClasscode: message.get('PID.38').toString(),
          tribalCitizenship: message.get('PID.39').toString(),
        },
        nte: {
          setId: message.get('NTE.1').toString(),
          sourceOfComment: message.get('NTE.2').toString(),
          comment: message.get('NTE.3').toString(),
          commentType: message.get('NTE.4').toString(),
        },
        pd1: {
          livingDependency: message.get('PD1.1').toString(),
          livingArrangement: message.get('PD1.2').toString(),
          patientPrimaryFacility: message.get('PD1.3').toString(),
          patientPrimaryCareProviderNameandIDNo: message.get('PD1.4').toString(),
          studentIndicator: message.get('PD1.5').toString(),
          handicap: message.get('PD1.6').toString(),
          livingWillCode: message.get('PD1.7').toString(),
          organDonorCode: message.get('PD1.8').toString(),
          separateBill: message.get('PD1.9').toString(),
          duplicatePatient: message.get('PD1.10').toString(),
          publicityCode: message.get('PD1.11').toString(),
          protectionIndicator: message.get('PD1.12').toString(),
          protectionIndicatorEffectiveDate: message.get('PD1.13').toString(),
          placeofWorship: message.get('PD1.14').toString(),
          advanceDirectiveCode: message.get('PD1.15').toString(),
          immunizationRegistryStatus: message.get('PD1.16').toString(),
          immunizationRegistryStatusEffectiveDate: message.get('PD1.17').toString(),
          publicityCodeEffectiveDate: message.get('PD1.18').toString(),
          militaryBranch: message.get('PD1.19').toString(),
          militaryRankGrade: message.get('PD1.20').toString(),
          militaryStatus: message.get('PD1.21').toString(),
        },
        al1: {
          setId: message.get('AL1.1').toString(),
          allergenTypeCode: message.get('AL1.2').toString(),
          allergenCodeMnemonicDescription: message.get('AL1.3').toString(),
          allergySeverityCode: message.get('AL1.4').toString(),
          allergyReactionCode: message.get('AL1.5').toString(),
          identificationDate: message.get('AL1.6').toString(),
        },
        in1: {
          setId: message.get('IN1.1').toString(),
          insurancePlanID: message.get('IN1.2').toString(),
          insuranceCompanyID: message.get('IN1.3').toString(),
          insuranceCompanyName: message.get('IN1.4').toString(),
          insuranceCompanyAddress: message.get('IN1.5').toString(),
          insuranceCoContactPerson: message.get('IN1.6').toString(),
          insuranceCoPhoneNumber: message.get('IN1.7').toString(),
          groupNumber: message.get('IN1.8').toString(),
          groupName: message.get('IN1.9').toString(),
          insuredsGroupEmpID: message.get('IN1.10').toString(),
          insuredsGroupEmpName: message.get('IN1.11').toString(),
          planEffectiveDate: message.get('IN1.12').toString(),
          planExpirationDate: message.get('IN1.13').toString(),
          authorizationInformation: message.get('IN1.14').toString(),
          planType: message.get('IN1.15').toString(),
          nameOfInsured: message.get('IN1.16').toString(),
          insuredsRelationshipToPatient: message.get('IN1.17').toString(),
          insuredsDateOfBirth: message.get('IN1.18').toString(),
          insuredsAddress: message.get('IN1.19').toString(),
          assignmentOfBenefits: message.get('IN1.20').toString(),
          coordinationOfBenefits: message.get('IN1.21').toString(),
          coordOfBen_Priority: message.get('IN1.22').toString(),
          noticeOfAdmissionFlag: message.get('IN1.23').toString(),
          noticeOfAdmissionDate: message.get('IN1.24').toString(),
          reportOfEligibilityFlag: message.get('IN1.25').toString(),
          reportOfEligibilityDate: message.get('IN1.26').toString(),
          releaseInformationCode: message.get('IN1.27').toString(),
          pre_AdmitCert: message.get('IN1.28').toString(),
          verificationDateTime: message.get('IN1.29').toString(),
          verificationBy: message.get('IN1.30').toString(),
          typeOfAgreementCode: message.get('IN1.31').toString(),
          billingStatus: message.get('IN1.32').toString(),
          lifetimeReserveDays: message.get('IN1.33').toString(),
          delayBeforeL_R_Day: message.get('IN1.34').toString(),
          companyPlanCode: message.get('IN1.35').toString(),
          policyNumber: message.get('IN1.36').toString(),
          policyDeductible: message.get('IN1.37').toString(),
          policyLimit_Amount: message.get('IN1.38').toString(),
          policyLimit_Days: message.get('IN1.39').toString(),
          roomRate_Semi_Private: message.get('IN1.40').toString(),
          roomRate_Private: message.get('IN1.41').toString(),
          insuredsEmploymentStatus: message.get('IN1.42').toString(),
          insuredsAdministrativeSex: message.get('IN1.43').toString(),
          insuredsEmployersAddress: message.get('IN1.44').toString(),
          verificationStatus: message.get('IN1.45').toString(),
          priorInsurancePlanID: message.get('IN1.46').toString(),
          coverageType: message.get('IN1.47').toString(),
          handicap: message.get('IN1.48').toString(),
          insuredsIDNumber: message.get('IN1.49').toString(),
          signatureCode: message.get('IN1.50').toString(),
          signatureCodeDate: message.get('IN1.51').toString(),
          insured_sBirthPlace: message.get('IN1.52').toString(),
          vipIndicator: message.get('IN1.53').toString(),
        }
      }
    };

    const prescriber = {
      npi: message.get('OBR.16.1').toString(),
      name: {
        firstName: message.get('ORC.12.1').toString(),
        lastName: message.get('ORC.12.2').toString(),
      },
      // address: {
      //   line1: undefined,
      //   line2: undefined,
      //   zipcode: undefined,
      //   city: undefined,
      //   state: undefined,
      // },
      // contact: {
      //   phone: undefined,
      //   faxNumber: undefined,
      //   email: undefined,
      // },
      // license: {
      //   licenseType: undefined,
      //   licensenumber: undefined,
      // },
      // deaNumber: undefined,
      // practiceLocations: [{
      //   name: undefined,
      //   addressLine1: undefined,
      //   addressLine2: undefined,
      //   state: undefined,
      //   city: undefined,
      //   zipCode: undefined,
      //   phone: undefined,
      //   fax: undefined,
      //   officePhone: undefined,
      //   email: undefined,
      // }],
      // facility: undefined,
      // upinNumber: undefined,
      // spi: undefined,
      // insuranceRestriction: undefined,
      // medicalIdProviderNumber: undefined,
      // primaryCareProviderId: undefined,
    };

    const digitalSign = await createDigitalSign(message.get('ORC.3').toString(),message.get('OBR.16.1').toString());
    console.log('digi sign in hl7', digitalSign);

    let patientId = await savePatient(patient);


    let prescriberId = await savePrescriber(prescriber);
    let productId = await getProductName(message.get('RXE.2.4').toString());

    console.log('product', productId)

    const fillDate = message.get('ORC.9').toString().split(' ');
    const orderDate = message.get('ORC.7.4').toString().split(' ');

    const rx = {
      rxId: message.get('ORC.3').toString(),
      notification: '',
      rxType: 'external',
      patient_id: patientId,
      pharmacy_id: context.data.pharmacyId,
      productDetails: {
        productName: productId.id,
        name: productId.name,
        DEAClass:productId.DEA
      },
      prescriber_id: prescriberId,
      product_id: message.get('RXE.2.4').toString(),
      digitalSignature:digitalSign,
      image: '',
      refills: {
        endRefillDate: message.get('RXE.16').toString().split(' ').slice(-1)[0],
        orderDate: orderDate[0],
        total: message.get('RXE.18').toString(),
      },

      hl7: {
        hl7String: message.toString(),
        msh: {
          fieldSeparator: message.get('MSH.1').toString(),
          encodingCharacters: message.get('MSH.2').toString(),
          sendingApplication: message.get('MSH.3').toString(),
          sendingFacility: message.get('MSH.4').toString(),
          receivingApplication: message.get('MSH.5').toString(),
          receivingFacility: message.get('MSH.6').toString(),
          dateTimeOfMessage: message.get('MSH.7').toString(),
          security: message.get('MSH.8').toString(),
          messageType: message.get('MSH.9').toString(),
          messageControlID: message.get('MSH.10').toString(),
          processingID: message.get('MSH.11').toString(),
          versionID: message.get('MSH.12').toString(),
          sequenceNumber: message.get('MSH.13').toString(),
          continuationPointer: message.get('MSH.14').toString(),
          acceptAcknowledgmentType: message.get('MSH.15').toString(),
          applicationAcknowledgmentType: message.get('MSH.16').toString(),
          countryCode: message.get('MSH.17').toString(),
          characterSet: message.get('MSH.18').toString(),
          principalLanguageOfMessage: message.get('MSH.19').toString(),
          alternateCharacterSetHandlingScheme: message.get('MSH.20').toString(),
          messageProfileIdentifier: message.get('MSH.21').toString(),
        },
        evn: {
          eventTypeCode: message.get('EVN.1').toString(),
          recordedDateTime: message.get('EVN.2').toString(),
          dateTimePlannedEvent: message.get('EVN.3').toString(),
          eventReasonCode: message.get('EVN.4').toString(),
          operatorId: message.get('EVN.5').toString(),
          eventOccurred: message.get('EVN.6').toString(),
          eventFacility: message.get('EVN.7').toString(),
        },
        sft: {
          softwareVendorOrganization: message.get('SFT.1').toString(),
          softwareCertifiedVersionorReleaseNumber: message.get('SFT.2').toString(),
          softwareProductName: message.get('SFT.3').toString(),
          softwareBinaryId: message.get('SFT.4').toString(),
          softwareProductInformation: message.get('SFT.5').toString(),
          softwareInstallDate: message.get('SFT.6').toString(),
        },
        pv1: {
          setID: message.get('PV1.1').toString(),
          patientClass: message.get('PV1.2').toString(),
          assignedPatientLocation: message.get('PV1.3').toString(),
          admissionType: message.get('PV1.4').toString(),
          preadmitNumber: message.get('PV1.5').toString(),
          priorPatientLocation: message.get('PV1.6').toString(),
          attendingDoctor: message.get('PV1.7').toString(),
          referringDoctor: message.get('PV1.8').toString(),
          consultingDoctor: message.get('PV1.9').toString(),
          hospitalService: message.get('PV1.10').toString(),
          temporaryLocation: message.get('PV1.11').toString(),
          preadmitTestIndicator: message.get('PV1.12').toString(),
          re_admissionIndicator: message.get('PV1.13').toString(),
          admitSource: message.get('PV1.14').toString(),
          ambulatoryStatus: message.get('PV1.15').toString(),
          vipIndicator: message.get('PV1.16').toString(),
          admittingDoctor: message.get('PV1.17').toString(),
          patientType: message.get('PV1.18').toString(),
          visitNumber: message.get('PV1.19').toString(),
          financialClass: message.get('PV1.20').toString(),
          chargePriceIndicator: message.get('PV1.21').toString(),
          courtesyCode: message.get('PV1.22').toString(),
          creditRating: message.get('PV1.23').toString(),
          contractCode: message.get('PV1.24').toString(),
          contractEffectiveDate: message.get('PV1.25').toString(),
          contractAmount: message.get('PV1.26').toString(),
          contractPeriod: message.get('PV1.27').toString(),
          interestCode: message.get('PV1.28').toString(),
          transferToBadDebtCode: message.get('PV1.29').toString(),
          transferToBadDebtDate: message.get('PV1.30').toString(),
          badDebtAgencyCode: message.get('PV1.31').toString(),
          badDebtTransferAmount: message.get('PV1.32').toString(),
          badDebtRecoveryAmount: message.get('PV1.33').toString(),
          deleteAccountIndicator: message.get('PV1.34').toString(),
          deleteAccountDate: message.get('PV1.35').toString(),
          dischargeDisposition: message.get('PV1.36').toString(),
          dischargedtoLocation: message.get('PV1.37').toString(),
          dietType: message.get('PV1.38').toString(),
          servicingFacility: message.get('PV1.39').toString(),
          bedStatus: message.get('PV1.40').toString(),
          accountStatus: message.get('PV1.41').toString(),
          pendingLocation: message.get('PV1.42').toString(),
          priorTemporaryLocation: message.get('PV1.43').toString(),
          admitDateTime: message.get('PV1.44').toString(),
          dischargeDateTime: message.get('PV1.45').toString(),
          currentPatientBalance: message.get('PV1.46').toString(),
          totalCharges: message.get('PV1.47').toString(),
          totalAdjustments: message.get('PV1.48').toString(),
          totalPayments: message.get('PV1.49').toString(),
          alternateVisitId: message.get('PV1.50').toString(),
          visitIndicator: message.get('PV1.51').toString(),
          otherHealthcareProvider: message.get('PV1.52').toString(),
          // admissionDate:Date,
          // dischargeDate:Date,
        },
        pv2: {
          priorPendingLocation: message.get('PV2.1').toString(),
          accommodationCode: message.get('PV2.2').toString(),
          admitReason: message.get('PV2.3').toString(),
          transferReason: message.get('PV2.4').toString(),
          patientValuables: message.get('PV2.5').toString(),
          patientValuablesLocation: message.get('PV2.6').toString(),
          visitUserCode: message.get('PV2.7').toString(),
          expectedAdmitDateTime: message.get('PV2.8').toString(),
          expectedDischargeDateTime: message.get('PV2.9').toString(),
          estimatedLengthOfInpatientStay: message.get('PV2.10').toString(),
          actualLengthOfInpatientStay: message.get('PV2.11').toString(),
          visitDescription: message.get('PV2.12').toString(),
          referralSourceCode: message.get('PV2.13').toString(),
          previousServiceDate: message.get('PV2.14').toString(),
          employmentIllnessRelatedIndicator: message.get('PV2.15').toString(),
          purgeStatusCode: message.get('PV2.16').toString(),
          purgeStatusDate: message.get('PV2.17').toString(),
          specialProgramCode: message.get('PV2.18').toString(),
          retentionIndicator: message.get('PV2.19').toString(),
          expectedNumberofInsurancePlans: message.get('PV2.20').toString(),
          visitPublicityCode: message.get('PV2.21').toString(),
          visitProtectionIndicator: message.get('PV2.22').toString(),
          clinicOrganizationName: message.get('PV2.23').toString(),
          patientStatusCode: message.get('PV2.24').toString(),
          visitPriorityCode: message.get('PV2.25').toString(),
          previousTreatmentDate: message.get('PV2.26').toString(),
          expectedDischargeDisposition: message.get('PV2.27').toString(),
          signatureonFileDate: message.get('PV2.28').toString(),
          firstSimilarIllnessDate: message.get('PV2.29').toString(),
          patientChargeAdjustmentCode: message.get('PV2.30').toString(),
          recurringServiceCode: message.get('PV2.31').toString(),
          billingMediaCode: message.get('PV2.32').toString(),
          expectedSurgeryDateandTime: message.get('PV2.33').toString(),
          militaryPartnershipCode: message.get('PV2.34').toString(),
          militaryNon_AvailabilityCode: message.get('PV2.35').toString(),
          newbornBabyIndicator: message.get('PV2.36').toString(),
          babyDetainedIndicator: message.get('PV2.37').toString(),
          modeofArrivalCode: message.get('PV2.38').toString(),
          recreationalDrugUseCode: message.get('PV2.39').toString(),
          admissionLevelofCareCode: message.get('PV2.40').toString(),
          precautionCode: message.get('PV2.41').toString(),
          patientConditionCode: message.get('PV2.42').toString(),
          livingWillCode: message.get('PV2.43').toString(),
          organDonorCode: message.get('PV2.44').toString(),
          advanceDirectiveCode: message.get('PV2.45').toString(),
          patientStatusEffectiveDate: message.get('PV2.46').toString(),
          expectedLOAReturnDateTime: message.get('PV2.47').toString(),
          expectedPre_admissionTestingDateTime: message.get('PV2.48').toString(),
          notifyClergyCode: message.get('PV2.49').toString(),
        },
        orc: {
          orderControl: message.get('ORC.1').toString(),
          placerOrderNumber: message.get('ORC.2').toString(),
          fillerOrderNumber: message.get('ORC.3').toString(),
          placerGroupNumber: message.get('ORC.4').toString(),
          orderStatus: message.get('ORC.5').toString(),
          responseFlag: message.get('ORC.6').toString(),
          quantityTiming: message.get('ORC.7').toString(),
          parentOrder: message.get('ORC.8').toString(),
          dateTimeofTransaction: message.get('ORC.9').toString(),
          enteredBy: message.get('ORC.10').toString(),
          verifiedBy: message.get('ORC.11').toString(),
          //OrderingProvider: message.get('ORC.12').toString(),
          enterersLocation: message.get('ORC.13').toString(),
          callBackPhoneNumber: message.get('ORC.14').toString(),
          orderEffectiveDateTime: message.get('ORC.15').toString(),
          orderControlCodeReason: message.get('ORC.16').toString(),
          enteringOrganization: message.get('ORC.17').toString(),
          enteringDevice: message.get('ORC.18').toString(),
          actionBy: message.get('ORC.19').toString(),
          advancedBeneficiaryNoticeCode: message.get('ORC.20').toString(),
          orderingFacilityName: message.get('ORC.21').toString(),
          orderingFacilityAddress: message.get('ORC.22').toString(),
          orderingFacilityPhoneNumber: message.get('ORC.23').toString(),
          orderingProviderAddress: message.get('ORC.24').toString(),
          orderStatusModifier: message.get('ORC.25').toString(),
          advancedBeneficiaryNoticeOverrideReason: message.get('ORC.26').toString(),
          fillersExpectedAvailabilityDateTime: message.get('ORC.27').toString(),
          confidentialityCode: message.get('ORC.28').toString(),
          orderType: message.get('ORC.29').toString(),
          entererAuthorizationMode: message.get('ORC.30').toString(),
          parentUniversalServiceIdentifier: message.get('ORC.31').toString(),

        },
        rxe: {
          quantityTiming: message.get('RXE.1').toString(),
          giveCode: message.get('RXE.2').toString(),
          giveAmountMinimum: message.get('RXE.3').toString(),
          giveAmountMaximum: message.get('RXE.4').toString(),
          giveUnits: message.get('RXE.5').toString(),
          giveDosageForm: message.get('RXE.6').toString(),
          //providersAdministrationInstructions: message.get('RXE.7').toString(),
          deliverToLocation: message.get('RXE.8').toString(),
          substitutionStatus: message.get('RXE.9').toString(),
          dispenseAmount: message.get('RXE.10').toString(),
          dispenseUnits: message.get('RXE.11').toString(),
          numberOfRefills: message.get('RXE.12').toString(),
          orderingProvidersDEANumber: message.get('RXE.13').toString(),
          pharmacistTreatmentSuppliersVerifierId: message.get('RXE.14').toString(),
          prescriptNumber: message.get('RXE.15').toString(),
          totalDailyDose: message.get('RXE.19').toString(),
          needsHumanReview: message.get('RXE.20').toString(),
          pharmacyTreatmentSuppliersSpecialDispensingInstructions: message.get('RXE.21').toString(),
          givePer: message.get('RXE.22').toString(),
          giveRateAmount: message.get('RXE.23').toString(),
          giveRateUnits: message.get('RXE.24').toString(),
          giveStrength: message.get('RXE.25').toString(),
          giveStrengthUnits: message.get('RXE.26').toString(),
          giveIndication: message.get('RXE.27').toString(),
          dispensePackageSize: message.get('RXE.28').toString(),
          dispensePackageSizeUnit: message.get('RXE.29').toString(),
          dispensePackageMethod: message.get('RXE.30').toString(),
          supplementaryCode: message.get('RXE.31').toString(),
          originalOrderDateTime: message.get('RXE.32').toString(),
          giveDrugStrenthVolume: message.get('RXE.33').toString(),
          giveDrugStrengthVolumeUnits: message.get('RXE.34').toString(),
          controlledSubstanceSchedule: message.get('RXE.35').toString(),
          formularyStatus: message.get('RXE.36').toString(),
          pharmaceuticalSubstanceAlterenative: message.get('RXE.37').toString(),
          pharmacyOfMostRecentFill: message.get('RXE.38').toString(),
          initialDispenseAmount: message.get('RXE.39').toString(),
          dispensingPharmacy: message.get('RXE.40').toString(),
          dispensingPharmacyAddress: message.get('RXE.41').toString(),
          deliverToPatientLocation: message.get('RXE.42').toString(),
          deliverToAddress: message.get('RXE.43').toString(),
          pharmacyOrderType: message.get('RXE.44').toString(),
        },
        rxd: {
          dispenseSubIdCounter: message.get('RXD.1').toString(),
          dispenseGiveCode: message.get('RXD.2').toString(),
          dateTimeDispensed: message.get('RXD.3').toString(),
          actualDispenseAmount: message.get('RXD.4').toString(),
          actualDispenseUnits: message.get('RXD.5').toString(),
          actualDosageForm: message.get('RXD.6').toString(),
          prescriptionNumber: message.get('RXD.7').toString(),
          numberOfRefillsRemaining: message.get('RXD.8').toString(),
          dispenseNotes: message.get('RXD.9').toString(),
          dispensingProvider: message.get('RXD.10').toString(),
          substitutionStatus: message.get('RXD.11').toString(),
          totalDailyDose: message.get('RXD.12').toString(),
          dispenseToLocation: message.get('RXD.13').toString(),
          needsHumanReview: message.get('RXD.14').toString(),
          pharmacyTreatmentSuppliersSpecialDispensingInstructions: message.get('RXD.15').toString(),
          actualStrength: message.get('RXD.16').toString(),
          actualStrengthUnit: message.get('RXD.17').toString(),
          substanceLotNumber: message.get('RXD.18').toString(),
          substanceExpirationDate: message.get('RXD.19').toString(),
          substanceManufactureName: message.get('RXD.20').toString(),
          indication: message.get('RXD.21').toString(),
          dispensePackageSizeUnit: message.get('RXD.22').toString(),
          dispensePackageMethod: message.get('RXD.23').toString(),
          supplementaryCode: message.get('RXD.24').toString(),
          initiatingLocation: message.get('RXD.25').toString(),
          packagingAssemblyLocation: message.get('RXD.26').toString(),
          actualDrugStrengthVolume: message.get('RXD.27').toString(),
          actualDrugStrengthVolumeUnits: message.get('RXD.28').toString(),
          dispenseToPharmacy: message.get('RXD.29').toString(),
          dispenseToPharmacyAddress: message.get('RXD.30').toString(),
          pharmacyOrderType: message.get('RXD.31').toString(),
          dispensingType: message.get('RXD.32').toString(),
        },
        obr: {
          setId: message.get('OBR.1').toString(),
          placeOrderNumber: message.get('OBR.2').toString(),
          fillerOrderNumber: message.get('OBR.3').toString(),
          universalServiceIdentifier: message.get('OBR.4').toString(),
          priority_OBR: message.get('OBR.5').toString(),
          requestedDate: message.get('OBR.6').toString(),
          observationDate: message.get('OBR.7').toString(),
          observationEndDate: message.get('OBR.8').toString(),
          collectionVolume: message.get('OBR.9').toString(),
          collectorIdentifier: message.get('OBR.10').toString(),
          specimenActionCode: message.get('OBR.11').toString(),
          dangerCode: message.get('OBR.12').toString(),
          relevantClinicalInformation: message.get('OBR.13').toString(),
          specimenReceivedDate: message.get('OBR.14').toString(),
          specimenSource: message.get('OBR.15').toString(),
          //orderingProvider: message.get('OBR.16').toString(),
          orderCallbackPhoneNumber: message.get('OBR.17').toString(),
          placerField1: message.get('OBR.18').toString(),
          placerField2: message.get('OBR.19').toString(),
          fillerField1: message.get('OBR.20').toString(),
          fillerField2: message.get('OBR.21').toString(),
          resultsRptStatusChng_Date: message.get('OBR.22').toString(),
          chargeToPractice: message.get('OBR.23').toString(),
          diagnosticServSectId: message.get('OBR.24').toString(),
          resultStatus: message.get('OBR.25').toString(),
          parentResult: message.get('OBR.26').toString(),
          quantityTiming: message.get('OBR.27').toString(),
          resultCopiesTo: message.get('OBR.28').toString(),
          parentNumber: message.get('OBR.29').toString(),
          transportationMode: message.get('OBR.30').toString(),
          reasonForStudy: message.get('OBR.31').toString(),
          principalResultInterpreter: message.get('OBR.32').toString(),
          assistantResultInterpreter: message.get('OBR.33').toString(),
          technician: message.get('OBR.34').toString(),
          transcriptionist: message.get('OBR.35').toString(),
          scheduledDateTime: message.get('OBR.36').toString(),
          numberOfSampleContainers: message.get('OBR.37').toString(),
          transportLogisticsOfCollectedSample: message.get('OBR.38').toString(),
          collectorsComment: message.get('OBR.39').toString(),
          transportArrangementResponsibility: message.get('OBR.40').toString(),
          transportArranged: message.get('OBR.41').toString(),
          escortRequired: message.get('OBR.42').toString(),
          plannedPatientTransportComment: message.get('OBR.43').toString(),
          procedureCode: message.get('OBR.44').toString(),
          procedureCodeModifier: message.get('OBR.45').toString(),
          placerSupplementalServiceInformation: message.get('OBR.46').toString(),
          fillerSupplementalServiceInformation: message.get('OBR.47').toString(),
          medicallyNecessaryDuplicateProcedureReason: message.get('OBR.48').toString(),
          resultHandling: message.get('OBR.49').toString(),
          parentUniversalServiceIdentifier: message.get('OBR.50').toString(),
        },
        obx: {
          setId: message.get('OBX.1').toString(),
          valueType: message.get('OBX.2').toString(),
          observationIdentifier: message.get('OBX.3').toString(),
          observationSubId: message.get('OBX.4').toString(),
          observationValue: message.get('OBX.5').toString(),
          units: message.get('OBX.6').toString(),
          referencesRanges: message.get('OBX.7').toString(),
          abnormalFlags: message.get('OBX.8').toString(),
          probability: message.get('OBX.9').toString(),
          natureOfAbnormalTest: message.get('OBX.10').toString(),
          observationResultStatus: message.get('OBX.11').toString(),
          effectiveDateOfReferenceRange: message.get('OBX.12').toString(),
          userDefinedAccessChecks: message.get('OBX.13').toString(),
          dateTimeOfTheObservation: message.get('OBX.14').toString(),
          producersId: message.get('OBX.15').toString(),
          responsibleObserver: message.get('OBX.16').toString(),
          observationMethod: message.get('OBX.17').toString(),
          equipmentInstanceIdentifier: message.get('OBX.18').toString(),
          dateTimeOfTheAnalysis: message.get('OBX.19').toString(),
          reservedForV2_6: message.get('OBX.20').toString(),
          reservedForV2_6_1: message.get('OBX.21').toString(),
          reservedForV2_6_2: message.get('OBX.22').toString(),
          performingOrganizationName: message.get('OBX.23').toString(),
          performingOrganizationAddress: message.get('OBX.24').toString(),
          performingOrganicationMedicalDirector: message.get('OBX.25').toString(),
        },
        nte: {
          setId: message.get('NTE.1').toString(),
          sourceOfComment: message.get('NTE.2').toString(),
          comment: message.get('NTE.3').toString(),
          commentType: message.get('NTE.4').toString(),
        },
        nk1: {
          setId: message.get('NK1.1').toString(),
          nkName: message.get('NK1.2').toString(),
          relationship: message.get('NK1.3').toString(),
          address: message.get('NK1.4').toString(),
          phoneNumber: message.get('NK1.5').toString(),
          businessPhoneNumber: message.get('NK1.6').toString(),
          contactRole: message.get('NK1.7').toString(),
          startDate: message.get('NK1.8').toString(),
          endDate: message.get('NK1.9').toString(),
          nextOfKinAssociatedPartiesJobTitle: message.get('NK1.10').toString(),
          nextOfKinAssociatedPartiesJobCodeClass: message.get('NK1.11').toString(),
          nextOfKinAssociatedPartiesEmployeeNumber: message.get('NK1.12').toString(),
          organizationNameNK1: message.get('NK1.13').toString(),
          martialStatus: message.get('NK1.14').toString(),
          administrativeSex: message.get('NK1.15').toString(),
          dateTimeOfBirth: message.get('NK1.16').toString(),
          livingDependency: message.get('NK1.17').toString(),
          ambulatoryStatus: message.get('NK1.18').toString(),
          citizenship: message.get('NK1.19').toString(),
          primaryLanguage: message.get('NK1.20').toString(),
          livingArrangement: message.get('NK1.21').toString(),
          publicityCode: message.get('NK1.22').toString(),
          protectionIndicator: message.get('NK1.23').toString(),
          studentIndicator: message.get('NK1.24').toString(),
          religion: message.get('NK1.25').toString(),
          mothersMaidenName: message.get('NK1.26').toString(),
          nationality: message.get('NK1.27').toString(),
          ethnicGroup: message.get('NK1.28').toString(),
          contactReason: message.get('NK1.29').toString(),
          contactPersonsName: message.get('NK1.30').toString(),
          contactPersonsTelephoneNumber: message.get('NK1.31').toString(),
          contactPersonsAddress: message.get('NK1.32').toString(),
          nextOfKinAssociatedPartysIdentifiers: message.get('NK1.33').toString(),
          jobStatus: message.get('NK1.34').toString(),
          race: message.get('NK1.35').toString(),
          handicap: message.get('NK1.36').toString(),
          contactPersonSocialSecurityNumber: message.get('NK1.37').toString(),
          nextOfKinBirthPlace: message.get('NK1.38').toString(),
          vipIndicator: message.get('NK1.39').toString(),
        },
        tq1: {
          setId: message.get('TQ1.1').toString(),
          quantity: message.get('TQ1.2').toString(),
          repeatPattern: message.get('TQ1.3').toString(),
          explicitTime: message.get('TQ1.4').toString(),
          relativeTimeAndUnits: message.get('TQ1.5').toString(),
          serviceDuration: message.get('TQ1.6').toString(),
          startDateTtime: message.get('TQ1.7').toString(),
          endDateTime: message.get('TQ1.8').toString(),
          priority: message.get('TQ1.9').toString(),
          conditionText: message.get('TQ1.10').toString(),
          textInstruction: message.get('TQ1.11').toString(),
          conjunction: message.get('TQ1.12').toString(),
          occurrenceDuration: message.get('TQ1.13').toString(),
          totalOccurrences: message.get('TQ1.14').toString(),
        },
        tq2: {
          setId: message.get('TQ2').toString(),
          sequenceResultsFlag: message.get('TQ2').toString(),
          relatedPlacerNumber: message.get('TQ2').toString(),
          relatedFillerNumber: message.get('TQ2').toString(),
          relatedPlacerGroupNumber: message.get('TQ2').toString(),
          sequenceConditionCode: message.get('TQ2').toString(),
          cyclicEntryExitIndicator: message.get('TQ2').toString(),
          sequenceConditionTimeInterval: message.get('TQ2').toString(),
          cyclicGroupMaximumNumberOfRepeats: message.get('TQ2').toString(),
          specialServiceRequestRelationship: message.get('TQ2').toString(),

        },
        ft1: {
          setId: message.get('FT1.1').toString(),
          transactionId: message.get('FT1.2').toString(),
          transactionBatchId: message.get('FT1.3').toString(),
          transactionDate: message.get('FT1.4').toString(),
          transactionPostingDate: message.get('FT1.5').toString(),
          transactionType: message.get('FT1.6').toString(),
          transactionCode: message.get('FT1.7').toString(),
          transactionDescription: message.get('FT1.8').toString(),
          transactionDescriptionAlt: message.get('FT1.9').toString(),
          transactionQuantity: message.get('FT1.10').toString(),
          transactionAmountExtended: message.get('FT1.11').toString(),
          transactionAmountUnit: message.get('FT1.12').toString(),
          departmentCode: message.get('FT1.13').toString(),
          insurancePlanId: message.get('FT1.14').toString(),
          insuranceAmount: message.get('FT1.15').toString(),
          assignedPatientLocation: message.get('FT1.16').toString(),
          feeSchedule: message.get('FT1.17').toString(),
          patientType: message.get('FT1.18').toString(),
          diagnosisCodeFT1: message.get('FT1.19').toString(),
          performedByCode: message.get('FT1.20').toString(),
          orderedByCode: message.get('FT1.21').toString(),
          unitCost: message.get('FT1.22').toString(),
          fillerOrderNumber: message.get('FT1.23').toString(),
          enteredByCode: message.get('FT1.24').toString(),
          procedureCode: message.get('FT1.25').toString(),
          procedureCodeModifier: message.get('FT1.26').toString(),
          advancedBeneficiaryNoticeCode: message.get('FT1.27').toString(),
          medicallyNecessaryDuplicateProcedureReason: message.get('FT1.28').toString(),
          ndcCode: message.get('FT1.29').toString(),
          paymentReferenceId: message.get('FT1.30').toString(),
          transactionReferenceKey: message.get('FT1.31').toString(),
        },
        cti: {
          sponsorStudyId: message.get('CTI.1').toString(),
          studyPhaseIdentifier: message.get('CTI.2').toString(),
          studyScheduledTimePoint: message.get('CTI.3').toString(),
        },
        ctd: {
          contactRole: message.get('CTD.1').toString(),
          contactName: message.get('CTD.2').toString(),
          contactAddress: message.get('CTD.3').toString(),
          contactLocation: message.get('CTD.4').toString(),
          contactCommunicationInformation: message.get('CTD.5').toString(),
          preferredMethodOfContact: message.get('CTD.6').toString(),
          contactIdentifiers: message.get('CTD.7').toString(),
        },
        spm: {
          setId: message.get('SPM.1').toString(),
          specimentId: message.get('SPM.2').toString(),
          specimenParentIds: message.get('SPM.3').toString(),
          specimenType: message.get('SPM.4').toString(),
          specimenTypeModifier: message.get('SPM.5').toString(),
          specimenAdditives: message.get('SPM.6').toString(),
          specimenCollectionMethod: message.get('SPM.7').toString(),
          specimenSourceSite: message.get('SPM.8').toString(),
          specimenSourceSiteModifier: message.get('SPM.9').toString(),
          specimenCollectionSite: message.get('SPM.10').toString(),
          specimenRole: message.get('SPM.11').toString(),
          specimenCollectionAmount: message.get('SPM.12').toString(),
          groupedSpecimenCount: message.get('SPM.13').toString(),
          specimenDescription: message.get('SPM.14').toString(),
          specimenHandlingCode: message.get('SPM.15').toString(),
          specimenRiskCode: message.get('SPM.16').toString(),
          specimenCollectionDateTime: message.get('SPM.17').toString(),
          specimenReceivedDateTime: message.get('SPM.18').toString(),
          specimenExpirationDateTime: message.get('SPM.19').toString(),
          specimenAvailability: message.get('SPM.20').toString(),
          specimenRejectReason: message.get('SPM.21').toString(),
          specimenQuality: message.get('SPM.22').toString(),
          specimenAppropriateness: message.get('SPM.23').toString(),
          specimenCondition: message.get('SPM.24').toString(),
          specimenCurrentQuantity: message.get('SPM.25').toString(),
          numberofSpecimenContainers: message.get('SPM.26').toString(),
          containerType: message.get('SPM.27').toString(),
          containerCondition: message.get('SPM.28').toString(),
          specimenChildRole: message.get('SPM.29').toString(),
        },
        dsc: {
          continuationPointer: message.get('DSC.1').toString(),
          continuationStyle: message.get('DSC.2').toString(),
        }
      },
    };
    console.log('numberfills', message.get('RXE.17').toString())

    let fill = {
      daw: null,
      unitOfMeasure: '',
      rxOriginCode: '',
      iou: 0,
      billTo: 'CASH',
      sig: {
        code: '',
        description: message.get('RXE.7').toString(),
      },
      number: message.get('RXE.17').toString(),
      quantityDispensed: 0,
      daysSupply: message.get('ORC.17').toString(),
      usualAndCustomerCharge: undefined,
      rxImage: {
        drug: '',
        label: '',
        optional: '',
      },
      user: {
        username: '',
        lastAction: '',
        dispensingFee: 0,
      },
      billing: {
        billingType: '',
        insurance: {
          planId: '',
          name: '',
          insurancePaid: 0,
          ingredientCostPaid: 0,
          dispensingFeePaid: 0,
          flatSalesTax: 0,
          salesTaxRate: 0,
          SalesTaxBasis: 0,
          percentOfSalesTax: 0,
        },
        patientPaid: 0,
        acqPrice: 0,
        awpPrice: 0,
        billed: 0,
        totalPaid: 0,
        profitMargin: 0,
      },
      package: {
        package_priceId: 0,
      },
      amount: {
        cashPrice: 0,
        price: 0,
      },
      reject: {
        comment: '',
        reasonType: '',
      },
      status: null,
      deliveryMethod: '',
      orderedQuantity: null,
      verificationStatus: 'Draft',
      fillDate: fillDate[0],
    };


    let rx_id = await saveRx(rx, fill);

    return context;

  };
};
