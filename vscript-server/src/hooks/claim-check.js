// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html


const {Claim} = require('./models/claim.model');

const tls = require('tls');


// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    let result = await claimResponse(context);
    context.result = result;
    return context;
  };
};


function claimResponse(context) {
  return new Promise(resolve => {
    const options = {
      host: context.app.get('eClaim').host,
      port: context.app.get('eClaim').port,
    };

    let eligibilityData;
    let claimsData;

    let writeBuffer = '';

    const socket = tls.connect(options, () => {
      if (socket) {
        console.log(`Successfully connected ${options.host} : ${socket.remotePort}
        ${socket.authorized ? 'authorized' : 'unauthorized'} Local Port: ${socket.localPort}`);
        // process.stdin.pipe(socket);
      }
    });
    //
    socket.setEncoding('utf8');
    let claims = new Claim(context.data);
    console.log('Params: ', context.params.query.claimType);
    switch (context.params.query.claimType) {
      case 'eligibility':
        eligibilityData = claims.addTranmissionWrapper(claims.eligibilityString, '');
        writeBuffer = Buffer.from(eligibilityData, 'ASCII');
        console.log(eligibilityData);
        break;
      case 'b1':
        claimsData = claims.addTranmissionWrapper(claims.claimB1String, '');
        writeBuffer = Buffer.from(claimsData, 'ASCII');
        console.log(claimsData);
        break;
      case 'b1Dual':
        claimsData = claims.addTranmissionWrapper(claims.claimB1DualString, '');
        writeBuffer = Buffer.from(claimsData, 'ASCII');
        console.log('Dual', claimsData);
        break;
      case 'b1Gov':
        claimsData = claims.addTranmissionWrapper(claims.claimB1GovString, '');
        writeBuffer = Buffer.from(claimsData, 'ASCII');
        break;
      case 'b1GovDual':
        claimsData = claims.addTranmissionWrapper(claims.claimB1GovDualString, '');
        writeBuffer = Buffer.from(claimsData, 'ASCII');
        break;
      case 'b1Prior':
        claimsData = claims.addTranmissionWrapper(claims.claimB1PriorString, '');
        writeBuffer = Buffer.from(claimsData, 'ASCII');
        console.log(claimsData);
        break;
      case 'b1DUR':
        claimsData = claims.addTranmissionWrapper(claims.claimB1DURString, '');
        writeBuffer = Buffer.from(claimsData, 'ASCII');
        console.log(claimsData);
        break;
      case 'b1MultipleDrug':
        claimsData = claims.addTranmissionWrapper(claims.claimB1MultipleDrugs, '');
        writeBuffer = Buffer.from(claimsData, 'ASCII');
        break;
      case 'b1IsVaccine':
        claimsData = claims.addTranmissionWrapper(claims.claimB1IsVaccine, '');
        writeBuffer = Buffer.from(claimsData, 'ASCII');
        break;
      case 'b21':
        claimsData = claims.addTranmissionWrapper(claims.claimB21String, '');
        writeBuffer = Buffer.from(claimsData, 'ASCII');
        console.log(claimsData);
        break;
      case 'b22':
        claimsData = claims.addTranmissionWrapper(claims.claimB22String, '');
        writeBuffer = Buffer.from(claimsData, 'ASCII');
        break;
      case 'b23':
        claimsData = claims.addTranmissionWrapper(claims.claimB23String, '');
        writeBuffer = Buffer.from(claimsData, 'ASCII');
        break;
      default:
        claimsData = claims.addTranmissionWrapper(claims.claimB1String, '');
        writeBuffer = Buffer.from(claimsData, 'ASCII');
        break;
    }


    socket.write(writeBuffer);

    socket.on('data', function (data) {
      let requestArray = [];
      requestArray = claimsData.split('\u001c');
      let responseString = ResponseString(data);
      //let requestArray = [] = requestString.slice('\u001c');
      let responsingArray = [] = responseString.split('\u001c');
      if (context.params.claimType === 'eligibility') {
        let dataResp = {
          insurancetype: '',
          insurancename: '',
          binnumber: '',
          insurancecode: '',
          processorcontrolnumber: '',
          groupnumber: '',
          patientrelationship: '',
          status: '',
          message: '',
        };
        let responseArray = [] = responseString.split('\u001c');
        responseArray.forEach(function (resp) {
          if (resp.startsWith('AN')) {
            if (resp.endsWith('A')) {
              dataResp.status = 'Accepted';
            }
            else {
              dataResp.status = 'Rejected';
            }
          }
          if (resp.startsWith('7C')) {
            dataResp.binnumber = resp.substring(2);
          }
          if (resp.startsWith('NU')) {
            dataResp.insurancecode = resp.substring(2);
          }
          if (resp.startsWith('MH')) {
            dataResp.processorcontrolnumber = resp.substring(2);
          }
          if (resp.startsWith('MJ')) {
            dataResp.groupnumber = resp.substring(2);
          }
          if (resp.startsWith('UV')) {
            dataResp.patientrelationship = resp.substring(2);
          }
          if (resp.startsWith('F4')) {
            dataResp.message = resp.substring(2);
          }
        });

        // console.log(dataResp);
        let dataRR = {
          datarequest: eligibilityData,
          Response: dataResp,
        };
        // console.log(dataRR);
        resolve(dataRR);
      }
      else {
        let responseArray = [] = responseString.split('\u001c');
        let dataResponse = {status: '', message: '', fqmessage: []};
        let rxInfo = {
          rxId: 0, patientId: '', prescriberId: '', unitPrice: '', insuranceCode: '', insurance1: '',
          billTo: '', drugDetails: {}, insuranceResponse: {}, userName: '',
          isResponded: false, profitMargin: 0, planid: [], prescriberlocation: '',
          billed: {ingredientCost: 0, dispensingFee: 0, customaryCharge: 0, grossAmountDue: 0},
          paymentInfo: {
            message: '', patientPay: 0, totalAmountPaid: 0, totalAmountPaid2: 0, totalAmountPaid3: 0,
            patientPay2: 0, patientPay3: 0, ingredientCostPaid: 0, dispensingfeePaid: 0, copay: 0,
            benefitStageCount: '', benfitStageQualifier: '', benefitstageamount: 0, amountattributedtocoveragegap: 0,
            basisofreimbursementdetermination: '', accumulateddeductibleamount: 0, remainingdeductibleamount: 0,
            otherpayercoveragetype: '', otherpayerid: '', otherpayerprocessorcontrolnumber: '',
            otherpayercardholderid: '', otherpayergroup: '', otherpayerpersoncode: '',
            otherpayerhelpdeskphonenumber: '', otherpayerrelationshipcode: '',
            otherpayerbenefiteffectivedate: '', otherpayerbenefitterminationdate: '',
            amountappliedtoperiodicdeductible: 0, dispensingfeecontracted: 0, insentivefee: 0,
            ingreadientcostcontracted: 0, flatsalestaxpaid: 0, percentagesalestaxamountpaid: 0,
            percentagesalestaxratepaid: 0,
            percentagesalestaxbasispaid: 0, taxexemtindicator: 0, amountAttributed: 0, amountofcoinsurance: 0
          },
          ErrorCodes: [],
          rejectResponse: {
            rejectCount: '', priorAuthNumber: '', additionalMessage: [], durmessage: '',
            reasonservicecode: ''
          },
        };

        let headerSegment = {
          binnumber: {value: '', description: 'binNumber'},
          versionorReleaseNumber: {value: '', description: 'version'},
          transactionCode: {value: '', description: 'transactionCode'},
          processorControlNumber: {value: '', description: 'processorControlNumber'},
          transactionCount: {value: '', description: 'transactionCount'},
          serviceProviderIdQualifier: {value: '', description: 'serviceProviderIdQualifier'},
          serviceProviderId: {value: '', description: 'serviceProviderId'},
          dateOfService: {value: '', description: 'dateOfService'},
          SoftWareVendorID: {value: '', description: 'SoftWareVendorID'}
        };

        let insuranceSegment = {
          cardholderID: {code: 'C2', value: '', description: 'cardholderID'},
          cardholderFirstName: {code: 'CC', value: '', description: 'cardholderFirstName'},
          cardholderLastName: {code: 'CD', value: '', description: 'cardholderLastName'},
          homePlan: {code: 'CE', value: '', description: 'homePlan'},
          planId: {code: 'FO', value: '', description: 'planId'},
          eligibilityClarificationCode: {code: 'C9', value: '', description: 'eligibilityClarificationCode'},
          groupId: {code: 'C1', value: '', description: 'groupId'},
          personCode: {code: 'C3', value: '', description: 'personCode'},
          patientRelationship: {code: 'C6', value: '', description: 'patientRelationship'}
        };

        let patientSegment = {
          patientIdQualifier: {code: 'CX', value: '', description: 'patientIdQualifier'},
          patientId: {code: 'CY', value: '', description: 'patientId'},
          dateOfBirth: {code: 'C4', value: '', description: 'dateOfBirth'},
          patientGenderCode: {code: 'C5', value: '', description: 'patientGenderCode'},
          patientFirstName: {code: 'CA', value: '', description: 'patientFirstName'},
          patientLastName: {code: 'CB', value: '', description: 'patientLastName'},
          streetAddress: {code: 'CM', value: '', description: 'streetAddress'},
          city: {code: 'CN', value: '', description: 'city'},
          state: {code: 'CO', value: '', description: 'state'},
          zipCode: {code: 'CP', value: '', description: 'zipCode'},
          phone: {code: 'CQ', value: '', description: 'phone'},
          placeofService: {code: 'C7', value: '', description: 'placeofService'},
          email: {code: 'HN', value: '', description: 'email'},
          patientResidence: {code: '4X', value: '', description: 'patientResidence'}
        };

        let prescriberSegment = {
          prescriberIdQualifier: {code: 'EZ', value: '', description: 'prescriberIdQualifier'},
          prescriberId: {code: 'DB', value: '', description: 'prescriberId'},
          prescriberFirstName: {code: '2J', value: '', description: 'prescriberFirstName'},
          prescriberLastName: {code: 'DR', value: '', description: 'prescriberLastName'},
          phone: {code: 'PM', value: '', description: 'phone'},
          primaryCareProviderIdQualifier: {code: '2E', value: '', description: 'primaryCareProviderIdQualifier'},
          primaryCareProviderId: {code: 'DL', value: '', description: 'primaryCareProviderId'},
          primaryCareProviderLastName: {code: '4E', value: '', description: 'primaryCareProviderLastName'},
          street: {code: '2K', value: '', description: 'street'},
          city: {code: '2M', value: '', description: 'city'},
          state: {code: '2N', value: '', description: 'state'},
          zip: {code: '2P', value: '', description: 'zip'},
        };
        let claimSegment = {
          serviceReferenceNumberQualifier: {code: 'EM', value: '', description: 'serviceReferenceNumberQualifier'},
          serviceReferenceNumber: {code: 'D2', value: '', description: 'serviceReferenceNumber'},
          serviceIDQualifier: {code: 'E1', value: '', description: 'serviceIDQualifier'},
          productID: {code: 'D7', value: '', description: 'productID'},
          ProcedureModifierCodeCount: {code: 'SE', value: '', description: 'ProcedureModifierCodeCount'},
          procedureCodeModifier: {code: 'ER', value: '', description: 'procedureCodeModifier'},
          quantityDispensed: {code: 'E7', value: '', description: 'quantityDispensed'},
          fillNumber: {code: 'D3', value: '', description: 'fillNumber'},
          daysSupply: {code: 'D5', value: '', description: 'daysSupply'},
          compoundCode: {code: 'D6', value: '', description: 'compoundCode'},
          DAW: {code: 'D8', value: '', description: 'DAW'},
          dateOfprescription: {code: 'DE', value: '', description: 'dateOfprescription'},
          Refills: {code: 'DF', value: '', description: 'Refills'},
          submissionClarificationCodeCount: {code: 'NX', value: '', description: 'submissionClarificationCodeCount'},
          submissionClarificationCode: {code: 'DK', value: '', description: 'submissionClarificationCode'},
          specialPackagingIndicator: {code: 'DT', value: '', description: 'specialPackagingIndicator'},
          scheduledPrescriptionIdNumber: {code: 'EK', value: '', description: 'scheduledPrescriptionIdNumber'},
          unitOfMeasure: {code: '28', value: '', description: 'unitOfMeasure'},
          levelOfSerivce: {code: 'DI', value: '', description: 'levelOfSerivce'},
          intermediaryauthorizationtypeid: {code: 'EW', value: '', description: 'intermediaryauthorizationtypeid'},
          intermediaryAuthorizationId: {code: 'EX', value: '', description: 'intermediaryAuthorizationId'},
          pharmacyServiceType: {code: 'U7', value: '', description: 'pharmacyServiceType'},
          priorAuthNumber: {code: 'EV', value: '', description: 'priorAuthNumber'},
          priorAuthorizationCode: {code: 'EU', value: '', description: 'priorAuthorizationCode'},
          prescriptionOriginCode: {code: 'DJ', value: '', description: 'prescriptionOriginCode'},
          OriginallyserviceIDqualifier: {code: 'EJ', value: '', description: 'OriginallyserviceIDqualifier'},
          originallyServiceCode: {code: 'EA', value: '', description: 'originallyServiceCode'},
          originallyPrescribedQuantity: {code: 'EB', value: '', description: 'originallyPrescribedQuantity'},
          otherCoverageCode: {code: 'C8', value: '', description: 'otherCoverageCode'},
          patientAssignmentIndicator: {code: 'MT', value: '', description: 'patientAssignmentIndicator'},
        };
        let priceSegment = {
          ingredientCost: {code: 'D9', value: '', description: 'ingredientCost'},
          dispensingFee: {code: 'DC', value: '', description: 'dispensingFee'},
          patientPaidAmountSubmitted: {code: 'DX', value: '', description: 'patientPaidAmountSubmitted'},
          usualAndCustomerCharge: {code: 'DQ', value: '', description: 'usualAndCustomerCharge'},
          grossAmountDue: {code: 'DU', value: '', description: 'grossAmountDue'},
          basisOfCostDetermination: {code: 'DN', value: '', description: 'basisOfCostDetermination'},
          flatSalesTaxAmountSubmitted: {code: 'HA', value: '', description: 'flatSalesTaxAmountSubmitted'},
          percentageSalesTaxAmountPaid: {code: 'GE', value: '', description: 'percentageSalesTaxAmountPaid'},
          percentageSalesTaxRatePaid: {code: 'HE', value: '', description: 'percentageSalesTaxRatePaid'},
          percentageSalesTaxBasisPaid: {code: 'JE', value: '', description: 'percentageSalesTaxBasisPaid'},
        };

        let DURPPSsegment = {
          DUROrPPSCodeCounter: {code: '7E', value: '', description: 'DUROrPPSCodeCounter'},
          reasonForServiceCode: {code: 'E4', value: '', description: 'reasonForServiceCode'},
          professionalServiceCode: {code: 'E5', value: '', description: 'professionalServiceCode'},
          resultOfServiceCode: {code: 'E6', value: '', description: 'resultOfServiceCode'},
          DURCoAgentIDQualifier: {code: 'J9', value: '', description: 'DURCoAgentIDQualifier'},
          DURCoAgentID: {code: 'H6', value: '', description: 'DURCoAgentID'},
        };


        let otherPayerSegment = {
          otherPaymentsCount: {code: '4C', value: '', description: 'otherPaymentsCount'},
          otherpayercoveragetype: {code: '5C', value: '', description: 'otherpayercoveragetype'},
          otherPayerIDQualifier: {code: '6C', value: '', description: 'otherPayerIDQualifier'},
          otherpayerid: {code: '7C', value: '', description: 'otherpayerid'},
          otherPayerDate: {code: 'E8', value: '', description: 'otherPayerDate'},
          otherPayerPatientAmountCount: {code: 'NR', value: '', description: 'otherPayerPatientAmountCount'},
          otherPayerPatientAmountQualifier: {code: 'NP', value: '', description: 'otherPayerPatientAmountQualifier'},
          otherPayerPatientAmount: {code: 'NQ', value: '', description: 'otherPayerPatientAmount'},
          benefitStageCount: {code: 'MU', value: '', description: 'benefitStageCount'},
          benfitStageQualifier: {code: 'MV', value: '', description: 'benfitStageQualifier'},
          benfitStageAmount: {code: 'MW', value: '', description: 'benfitStageAmount'}
        };
        let responseHeaderSegment = {
          versionorReleaseNumber: {value: '', description: 'versionorReleaseNumber'},
          transactionCode: {value: '', description: 'transactionCode'},
          transactionCount: {value: '', description: 'transactionCount'},
          serviceProviderIdQualifier: {value: '', description: 'serviceProviderIdQualifier'},
          serviceProviderId: {value: '', description: 'serviceProviderId'},
          dateOfService: {value: '', description: 'dateOfService'},
        };
        let statusSegment = {
          responseStatus: {code: 'AN', value: '', description: 'responseStatus'},
          authorizationNumber: {code: 'F3', value: '', description: 'authorizationNumber'},
          additionalMessageCount: {code: 'UF', value: '', description: 'additionalMessageCount'},
          additionalMessageQualifier: {code: 'UH', value: '', description: 'additionalMessageQualifier'},
          additionalMessage: {code: 'FQ', value: [], description: 'additionalMessage'},
          helpDeskNumber: {code: '8F', value: '', description: 'helpDeskNumber'},
          rejectCount: {code: 'FA', value: '', description: 'rejectCount'},
          rejectCode: {code: 'FB', value: [], description: 'rejectCode'},
        };
        let responseClaimSegment = {
          serviceNumberQualifier: {code: 'EM', value: '', description: 'serviceNumberQualifier'},
          serviceNumber: {code: 'D2', value: '', description: 'serviceNumber'},
          productCount: {code: '9F', value: '', description: 'productCount'},
          productID: {code: 'AR', value: '', description: 'productID'},
        };
        let responsePriceSegment = {
          patientPay: {code: 'F5', value: '', description: 'patientPay'},
          ingredientCostPaid: {code: 'F6', value: '', description: 'ingredientCostPaid'},
          dispensingFeePaid: {code: 'F7', value: '', description: 'dispensingFeePaid'},
          taxExemptIndicator: {code: 'AV', value: '', description: 'taxExemptIndicator'},
          amountAttributed: {code: 'NZ', value: '', description: 'amountAttributed'},
          otherAmountPaidCount: {code: 'J2', value: '', description: 'otherAmountPaidCount'},
          otherAmountPaidQualifier: {code: 'J3', value: '', description: 'otherAmountPaidQualifier'},
          otherAmountPaid: {code: 'J4', value: '', description: 'otherAmountPaid'},
          basisofreimburementdetermination: {code: 'FM', value: '', description: 'basisofreimburementdetermination'},
          amountAttributedToSalesTax: {code: 'FN', value: '', description: 'amountAttributedToSalesTax'},
          amountOfCopay: {code: 'FI', value: '', description: 'amountOfCopay'},
          flatSalesTaxAmountPaid: {code: 'AW', value: '', description: 'flatSalesTaxAmountPaid'},
          patientSalesTaxAmount: {code: 'EQ', value: '', description: 'patientSalesTaxAmount'},
          insentiveFee: {code: 'FL', value: '', description: 'insentiveFee'},
          amountOfCoInsurance: {code: '4U', value: '', description: 'amountOfCoInsurance'},
          benefitStageAmount: {code: 'MW', value: '', description: 'benefitStageAmount'},
          persentageSalesTaxAmountPaid: {code: 'AX', value: '', description: 'persentageSalesTaxAmountPaid'},
          percentageSalesTaxRatePaid: {code: 'AY', value: '', description: 'percentageSalesTaxRatePaid'},
          percentageSalesTaxBasisPaid: {code: 'AZ', value: '', description: 'percentageSalesTaxBasisPaid'},
          amountAttributedToCoverageGap: {code: 'UP', value: '', description: 'amountAttributedToCoverageGap'},
          accumulatedDeductibleAmount: {code: 'FC', value: '', description: 'accumulatedDeductibleAmount'},
          remainingDeductibleAmount: {code: 'FD', value: '', description: 'remainingDeductibleAmount'},
          amountAppliedToPeriodicDeductible: {code: 'FH', value: '', description: 'amountAppliedToPeriodicDeductible'},
          ingreadientCostContracted: {code: 'U8', value: '', description: 'ingreadientCostContracted'},
          dispensingFeeContracted: {code: 'U9', value: '', description: 'dispensingFeeContracted'},
        };

        requestArray.forEach(function (r) {

          if (r.startsWith('CX')) {
            patientSegment.patientIdQualifier.value = r.substring(2);
          }
          if (r.startsWith('CY')) {
            patientSegment.patientId.value = r.substring(2);
          }
          if (r.startsWith('C4')) {
            patientSegment.dateOfBirth.value = r.substring(2);
          }
          if (r.startsWith('C5')) {
            patientSegment.patientGenderCode.value = r.substring(2);
          }
          if (r.startsWith('CA')) {
            patientSegment.patientFirstName.value = r.substring(2);
          }
          if (r.startsWith('CB')) {
            patientSegment.patientLastName.value = r.substring(2);
          }
          if (r.startsWith('CM')) {
            patientSegment.streetAddress.value = r.substring(2);
          }
          if (r.startsWith('CN')) {
            patientSegment.city.value = r.substring(2);
          }
          if (r.startsWith('CO')) {
            patientSegment.state.value = r.substring(2);
          }
          if (r.startsWith('CP')) {
            patientSegment.zipCode.value = r.substring(2);
          }
          if (r.startsWith('CQ')) {
            patientSegment.phone.value = r.substring(2);
          }
          if (r.startsWith('C7')) {
            patientSegment.placeofService.value = r.substring(2);
          }
          if (r.startsWith('HN')) {
            patientSegment.email.value = r.substring(2);
          }
          if (r.startsWith('4X')) {
            patientSegment.patientResidence.value = r.substring(2);
          }
          if (r.startsWith('C2')) {
            insuranceSegment.cardholderID.value = r.substring(2);
          }
          if (r.startsWith('CC')) {
            insuranceSegment.cardholderFirstName.value = r.substring(2);
          }
          if (r.startsWith('CD')) {
            insuranceSegment.cardholderLastName.value = r.substring(2);
          }
          if (r.startsWith('CE')) {
            insuranceSegment.homePlan.value = r.substring(2);
          }
          if (r.startsWith('FO')) {
            insuranceSegment.planId.value = r.substring(2);
          }
          if (r.startsWith('C9')) {
            insuranceSegment.eligibilityClarificationCode.value = r.substring(2);
          }
          if (r.startsWith('C1')) {
            insuranceSegment.groupId.value = r.substring(2);
          }
          if (r.startsWith('C3')) {
            insuranceSegment.personCode.value = r.substring(2);
          }
          if (r.startsWith('C6')) {
            insuranceSegment.patientRelationship.value = r.substring(2);
          }
          if (r.startsWith('EZ')) {
            prescriberSegment.prescriberIdQualifier.value = r.substring(2);
          }
          if (r.startsWith('DB')) {
            prescriberSegment.prescriberId.value = r.substring(2);
          }
          if (r.startsWith('2J')) {
            prescriberSegment.prescriberFirstName.value = r.substring(2);
          }
          if (r.startsWith('DR')) {
            prescriberSegment.prescriberLastName.value = r.substring(2);
          }
          if (r.startsWith('PM')) {
            prescriberSegment.phone.value = r.substring(2);
          }
          if (r.startsWith('2E')) {
            prescriberSegment.primaryCareProviderIdQualifier.value = r.substring(2);
          }
          if (r.startsWith('DL')) {
            prescriberSegment.primaryCareProviderId.value = r.substring(2);
          }
          if (r.startsWith('4E')) {
            prescriberSegment.primaryCareProviderLastName.value = r.substring(2);
          }
          if (r.startsWith('2K')) {
            prescriberSegment.street.value = r.substring(2);
          }
          if (r.startsWith('2M')) {
            prescriberSegment.city.value = r.substring(2);
          }
          if (r.startsWith('2N')) {
            prescriberSegment.state.value = r.substring(2);
          }
          if (r.startsWith('2P')) {
            prescriberSegment.zip.value = r.substring(2);
          }
          if (r.startsWith('EM')) {
            claimSegment.serviceReferenceNumberQualifier.value = r.substring(2);
          }
          if (r.startsWith('D2')) {
            claimSegment.serviceReferenceNumber.value = r.substring(2);
          }
          if (r.startsWith('E1')) {
            claimSegment.serviceIDQualifier.value = r.substring(2);
          }
          if (r.startsWith('D7')) {
            claimSegment.productID.value = r.substring(2);
          }
          if (r.startsWith('ER')) {
            claimSegment.procedureCodeModifier.value = r.substring(2);
          }
          if (r.startsWith('E7')) {
            claimSegment.quantityDispensed.value = r.substring(2);
          }
          if (r.startsWith('D3')) {
            claimSegment.fillNumber.value = r.substring(2);
          }
          if (r.startsWith('D5')) {
            claimSegment.daysSupply.value = r.substring(2);
          }
          if (r.startsWith('D6')) {
            claimSegment.compoundCode.value = r.substring(2);
          }
          if (r.startsWith('D8')) {
            claimSegment.DAW.value = r.substring(2);
          }
          if (r.startsWith('DE')) {
            claimSegment.dateOfprescription.value = r.substring(2);
          }
          if (r.startsWith('DF')) {
            claimSegment.Refills.value = r.substring(2);
          }
          if (r.startsWith('NX')) {
            claimSegment.submissionClarificationCodeCount.value = r.substring(2);
          }
          if (r.startsWith('DK')) {
            claimSegment.submissionClarificationCode.value = r.substring(2);
          }
          if (r.startsWith('DT')) {
            claimSegment.specialPackagingIndicator.value = r.substring(2);
          }
          if (r.startsWith('EK')) {
            claimSegment.scheduledPrescriptionIdNumber.value = r.substring(2);
          }
          if (r.startsWith('28')) {
            claimSegment.unitOfMeasure.value = r.substring(2);
          }
          if (r.startsWith('DI')) {
            claimSegment.levelOfSerivce.value = r.substring(2);
          }
          if (r.startsWith('EW')) {
            claimSegment.intermediaryauthorizationtypeid.value = r.substring(2);
          }
          if (r.startsWith('EX')) {
            claimSegment.intermediaryAuthorizationId.value = r.substring(2);
          }
          if (r.startsWith('U7')) {
            claimSegment.pharmacyServiceType.value = r.substring(2);
          }
          if (r.startsWith('EV')) {
            claimSegment.priorAuthNumber.value = r.substring(2);
          }
          if (r.startsWith('EU')) {
            claimSegment.priorAuthorizationCode.value = r.substring(2);
          }
          if (r.startsWith('C8')) {
            claimSegment.otherCoverageCode.value = r.substring(2);
          }
          if (r.startsWith('DJ')) {
            claimSegment.prescriptionOriginCode.value = r.substring(2);
          }
          if (r.startsWith('EJ')) {
            claimSegment.OriginallyserviceIDqualifier.value = r.substring(2);
          }
          if (r.startsWith('EA')) {
            claimSegment.originallyServiceCode.value = r.substring(2);
          }
          if (r.startsWith('EB')) {
            claimSegment.originallyPrescribedQuantity.value = r.substring(2);
          }
          if (r.startsWith('MT')) {
            claimSegment.patientAssignmentIndicator.value = r.substring(2);
          }
          if (r.startsWith('D9')) {
            priceSegment.ingredientCost.value = r.substring(2);
          }
          if (r.startsWith('DC')) {
            priceSegment.dispensingFee.value = r.substring(2);
          }
          if (r.startsWith('DX')) {
            priceSegment.patientPaidAmountSubmitted.value = r.substring(2);
          }
          if (r.startsWith('DQ')) {
            priceSegment.usualAndCustomerCharge.value = r.substring(2);
          }
          if (r.startsWith('DU')) {
            priceSegment.grossAmountDue.value = r.substring(2);
          }
          if (r.startsWith('DN')) {
            priceSegment.basisOfCostDetermination.value = r.substring(2);
          }
          if (r.startsWith('HA')) {
            priceSegment.flatSalesTaxAmountSubmitted.value = r.substring(2);
          }
          if (r.startsWith('GE')) {
            priceSegment.percentageSalesTaxAmountPaid.value = r.substring(2);
          }
          if (r.startsWith('HE')) {
            priceSegment.percentageSalesTaxRatePaid.value = r.substring(2);
          }
          if (r.startsWith('JE')) {
            priceSegment.percentageSalesTaxBasisPaid.value = r.substring(2);
          }
          if (r.startsWith('7E')) {
            DURPPSsegment.DUROrPPSCodeCounter.value = r.substring(2);
          }
          if (r.startsWith('E4')) {
            DURPPSsegment.reasonForServiceCode.value = r.substring(2);
          }
          if (r.startsWith('E5')) {
            DURPPSsegment.professionalServiceCode.value = r.substring(2);
          }
          if (r.startsWith('E6')) {
            DURPPSsegment.resultOfServiceCode.value = r.substring(2);
          }
          if (r.startsWith('J9')) {
            DURPPSsegment.DURCoAgentIDQualifier.value = r.substring(2);
          }
          if (r.startsWith('H6')) {
            DURPPSsegment.DURCoAgentID.value = r.substring(2);
          }
          if (r.startsWith('4C')) {
            otherPayerSegment.otherPaymentsCount.value = r.substring(2);
          }
          if (r.startsWith('5C')) {
            otherPayerSegment.otherpayercoveragetype.value = r.substring(2);
          }
          if (r.startsWith('6C')) {
            otherPayerSegment.otherPayerIDQualifier.value = r.substring(2);
          }
          if (r.startsWith('7C')) {
            otherPayerSegment.otherpayerid.value = r.substring(2);
          }
          if (r.startsWith('E8')) {
            otherPayerSegment.otherPayerDate.value = r.substring(2);
          }
          if (r.startsWith('NR')) {
            otherPayerSegment.otherPayerPatientAmountCount.value = r.substring(2);
          }
          if (r.startsWith('NP')) {
            otherPayerSegment.otherPayerPatientAmountQualifier.value = r.substring(2);
          }
          if (r.startsWith('NQ')) {
            otherPayerSegment.otherPayerPatientAmount.value = r.substring(2);
          }
          if (r.startsWith('MU')) {
            otherPayerSegment.benefitStageCount.value = r.substring(2);
          }
          if (r.startsWith('MV')) {
            otherPayerSegment.benfitStageQualifier.value = r.substring(2);
          }
          if (r.startsWith('MW')) {
            otherPayerSegment.benfitStageAmount.value = r.substring(2);
          }
        });

        responseArray.forEach(function (r) {
          // console.log(r.toString());
          if (r.startsWith('AN')) {
            if (r.endsWith('R')) {
              dataResponse.status = 'Rejected';
              statusSegment.responseStatus.value = 'Rejected';
            }
            else if (r.endsWith('P')) {
              dataResponse.status = 'Paid';
              statusSegment.responseStatus.value = 'Paid';
            }
            else if (r.endsWith('D')) {
              dataResponse.status = 'Duplicate';
              statusSegment.responseStatus.value = 'Duplicate';
            }
            else if (r.endsWith('A')) {
              dataResponse.status = 'Accepted';
              statusSegment.responseStatus.value = 'Accepted';
            }
            else if (r.endsWith('S')) {
              dataResponse.status = 'ReversalDuplicate';
              statusSegment.responseStatus.value = 'ReversalDuplicate';
            }
          }
          if (r.startsWith('F4')) {
            dataResponse.message = r.substring(2);
          }
          if (r.startsWith('F3')) {
            statusSegment.authorizationNumber = r.substring(2);
          }
          if (r.startsWith('FQ')) {
            dataResponse.fqmessage.push(r.substring(2));
          }

          if (r.startsWith('FB')) {
            rxInfo.ErrorCodes.push(r.substring(2));
            statusSegment.rejectCode.value.push(r.substring(2));
          }

          if (r.startsWith('F4')) {
            rxInfo.paymentInfo.message = r.substring(2);
          }

          if (r.startsWith('MU')) {
            rxInfo.paymentInfo.benefitStageCount = r.substring(2);
          }
          if (r.startsWith('8F')) {
            statusSegment.helpDeskNumber.value = r.substring(2);
          }

          if (r.startsWith('MV')) {
            rxInfo.paymentInfo.benfitStageQualifier = r.substring(2);
          }

          if (r.startsWith('FM')) {
            rxInfo.paymentInfo.basisofreimburementdetermination = r.substring(2);
          }

          if (r.startsWith('5C')) {
            rxInfo.paymentInfo.otherpayercoveragetype = r.substring(2);
          }
          if (r.startsWith('EM')) {
            responseClaimSegment.serviceNumberQualifier.value = r.substring(2);
          }
          if (r.startsWith('D2')) {
            responseClaimSegment.serviceNumber.value = r.substring(2);
          }
          if (r.startsWith('AR')) {
            responseClaimSegment.productID.value = r.substring(2);
          }
          if (r.startsWith('9F')) {
            responseClaimSegment.productCount.value = r.substring(2);
          }
          if (r.startsWith('7C')) {
            rxInfo.paymentInfo.otherpayerid = r.substring(2);
          }

          if (r.startsWith('MH')) {
            rxInfo.paymentInfo.otherpayerprocessorcontrolnumber = r.substring(2);
          }

          if (r.startsWith('NU')) {
            rxInfo.paymentInfo.otherpayercardholderid = r.substring(2);
          }

          if (r.startsWith('MJ')) {
            rxInfo.paymentInfo.otherpayergroup = r.substring(2);
          }

          if (r.startsWith('UV')) {
            rxInfo.paymentInfo.otherpayerperoncode = r.substring(2);
          }

          if (r.startsWith('UB')) {
            rxInfo.paymentInfo.otherpayerhelpdeskphonenumber = r.substring(2);
          }

          if (r.startsWith('UW')) {
            rxInfo.paymentInfo.otherpayerrelationshipcode = r.substring(2);
          }

          if (r.startsWith('UX')) {
            rxInfo.paymentInfo.otherpayerbenefiteffectivedate = r.substring(2);
          }

          if (r.startsWith('UY')) {
            rxInfo.paymentInfo.otherpayerbenefitterminationdate = r.substring(2);
          }

          if (r.startsWith('FQ')) {
            rxInfo.rejectResponse.additionalMessage.push(r.substring(2));
            statusSegment.additionalMessage.value.push(r.substring(2));
          }
          if (r.startsWith('UF')) {
            statusSegment.additionalMessageCount.value = r.substring(2);
          }
          if (r.startsWith('UH')) {
            statusSegment.additionalMessageQualifier.value = r.substring(2);
          }
          if (r.startsWith('PY')) {
            rxInfo.rejectResponse.priorAuthNumber = r.substring(2);
          }

          if (r.startsWith('FA')) {
            rxInfo.rejectResponse.rejectCount = r.substring(2);
          }

          if (r.startsWith('E4')) {
            // console.log('servicecode: ', r.substring(2));
            rxInfo.rejectResponse.reasonservicecode = r.substring(2);
          }

          if (r.startsWith('FY')) {
            console.log('DUR FREE TEXT MESSAGE: ', r.substring(2));
            rxInfo.rejectResponse.durmessage = r.substring(2);
          }
        });
        const claimLog = {
          userId: context.params.payload.userId,
          rxNumber: context.data.rxId,
          headerSegment: headerSegment,
          patientSegment: patientSegment,
          insuranceSegment: insuranceSegment,
          prescriberSegment: prescriberSegment,
          claimSegment: claimSegment,
          priceSegment: priceSegment,
          DURPPSsegment: DURPPSsegment,
          otherPayerSegment: otherPayerSegment,
          request: {
            requestData: claimsData,
            headerSegment: headerSegment,
            patientSegment: patientSegment,
            insuranceSegment: insuranceSegment,
            prescriberSegment: prescriberSegment,
            claimSegment: claimSegment,
            priceSegment: priceSegment,
            DURPPSsegment: DURPPSsegment,
            otherPayerSegment: otherPayerSegment,
          },
          response: {
            responseData: responseString,
            responseHeaderSegment: responseHeaderSegment,
            statusSegment: statusSegment,
            responseClaimSegment: responseClaimSegment,
            responsePriceSegment: responsePriceSegment
          },
          rejectReason: dataResponse.message,
          status: dataResponse.status,
          type: context.params.query.claimType === 'b21' ? 'B2' : 'B1',
          fqMessage: dataResponse.fqmessage,
        };

        context.app.service('claim-log').create(claimLog);
        responseArray = responseArray.splice(responseArray.indexOf('AM23'));
        console.log('claims', claimLog);
        for (let rs of responseArray) {
          if (rs.substring(0, 2) === 'F5') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.patientPay = parseFloat(parsingPrice(rs));
              responsePriceSegment.patientPay.value = parseFloat(parsingPrice(rs));
            } else if (rs.length === 2) {
              rxInfo.paymentInfo.patientPay = parseFloat(parsingPrice(rs));
              responsePriceSegment.patientPay.value = parseFloat(parsingPrice(rs));

            } else {
              rxInfo.paymentInfo.patientPay = parseFloat(parsingPrice(rs));
              responsePriceSegment.patientPay.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === 'F6') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.ingredientCostPaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.ingredientCostPaid.value = parseFloat(parsingPrice(rs));
            } else if (rs.length === 2) {
              rxInfo.paymentInfo.ingredientCostPaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.ingredientCostPaid = parseFloat(parsingPrice(rs));
            } else {
              rxInfo.paymentInfo.ingredientCostPaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.ingredientCostPaid.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === 'FL') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.insentivefee = parseFloat(parsingPrice(rs));
              responsePriceSegment.insentiveFee.value = parseFloat(parsingPrice(rs));
            } else if (rs.length === 2) {
              rxInfo.paymentInfo.insentivefee = parseFloat(parsingPrice(rs));
              responsePriceSegment.insentiveFee.value = parseFloat(parsingPrice(rs));
            } else {
              rxInfo.paymentInfo.insentivefee = parseFloat(parsingPrice(rs));
              responsePriceSegment.insentiveFee.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === 'F7') {
            rs = rs.substring(2);
            if (rs.length === 1) {

              rxInfo.paymentInfo.dispensingfeePaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.dispensingFeePaid.value = parseFloat(parsingPrice(rs));

            } else if (rs.length === 2) {
              rxInfo.paymentInfo.dispensingfeePaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.dispensingFeePaid.value = parseFloat(parsingPrice(rs));
            } else {
              rxInfo.paymentInfo.dispensingfeePaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.dispensingFeePaid.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === 'F9') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.totalAmountPaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.otherAmountPaid.value = parseFloat(parsingPrice(rs));

            } else if (rs.length === 2) {
              rxInfo.paymentInfo.totalAmountPaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.otherAmountPaid.value = parseFloat(parsingPrice(rs));

            } else {
              rxInfo.paymentInfo.totalAmountPaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.otherAmountPaid.value = parseFloat(parsingPrice(rs));

            }
          } else if (rs.substring(0, 2) === 'FI') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.copay = parseFloat(parsingPrice(rs));
              responsePriceSegment.amountOfCopay.value = parseFloat(parsingPrice(rs));
            } else if (rs.length === 2) {
              rxInfo.paymentInfo.copay = parseFloat(parsingPrice(rs));
              responsePriceSegment.amountOfCopay.value = parseFloat(parsingPrice(rs));
            } else {
              rxInfo.paymentInfo.copay = parseFloat(parsingPrice(rs));
              responsePriceSegment.amountOfCopay.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === 'NZ') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.amountattributed = parseFloat(parsingPrice(rs));
              responsePriceSegment.amountAttributed.value = parseFloat(parsingPrice(rs));
            } else if (rs.length === 2) {
              rxInfo.paymentInfo.amountattributed = parseFloat(parsingPrice(rs));
              responsePriceSegment.amountAttributed.value = parseFloat(parsingPrice(rs));
            } else {
              rxInfo.paymentInfo.amountattributed = parseFloat(parsingPrice(rs));
              responsePriceSegment.amountAttributed.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === '4U') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.amountofcoinsurance = parseFloat(parsingPrice(rs));
              responsePriceSegment.amountOfCoInsurance.value = parseFloat(parsingPrice(rs));
            } else if (rs.length === 2) {
              rxInfo.paymentInfo.amountofcoinsurance = parseFloat(parsingPrice(rs));
              responsePriceSegment.amountOfCoInsurance.value = parseFloat(parsingPrice(rs));
            } else {
              rxInfo.paymentInfo.amountofcoinsurance = parseFloat(parsingPrice(rs));
              responsePriceSegment.amountOfCoInsurance.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === 'MW') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.benefitstageamount = parseFloat(parsingPrice(rs));
              responsePriceSegment.benefitStageAmount.value = parseFloat(parsingPrice(rs));
            } else if (rs.length === 2) {
              rxInfo.paymentInfo.benefitstageamount = parseFloat(parsingPrice(rs));
              responsePriceSegment.benefitStageAmount.value = parseFloat(parsingPrice(rs));

            } else {
              rxInfo.paymentInfo.benefitstageamount = parseFloat(parsingPrice(rs));
              responsePriceSegment.benefitStageAmount.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === 'UP') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.amountattributedtocoveragegap = parseFloat(parsingPrice(rs));
              responsePriceSegment.amountAttributedToCoverageGap.value = parseFloat(parsingPrice(rs));
            } else if (rs.length === 2) {
              rxInfo.paymentInfo.amountattributedtocoveragegap = parseFloat(parsingPrice(rs));
              responsePriceSegment.amountAttributedToCoverageGap.value = parseFloat(parsingPrice(rs));
            } else {
              rxInfo.paymentInfo.amountattributedtocoveragegap = parseFloat(parsingPrice(rs));
              responsePriceSegment.amountAttributedToCoverageGap.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === 'FC') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.accumulateddeductibleamount = parseFloat(parsingPrice(rs));
              responsePriceSegment.accumulatedDeductibleAmount.value = parseFloat(parsingPrice(rs));
            } else if (rs.length === 2) {
              rxInfo.paymentInfo.accumulateddeductibleamount = parseFloat(parsingPrice(rs));
              responsePriceSegment.accumulatedDeductibleAmount.value = parseFloat(parsingPrice(rs));
            } else {
              rxInfo.paymentInfo.accumulateddeductibleamount = parseFloat(parsingPrice(rs));
              responsePriceSegment.accumulatedDeductibleAmount.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === 'FD') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.remainingdeductibleamount = parseFloat(parsingPrice(rs));
              responsePriceSegment.remainingDeductibleAmount.value = parseFloat(parsingPrice(rs));

            } else if (rs.length === 2) {
              rxInfo.paymentInfo.remainingdeductibleamount = parseFloat(parsingPrice(rs));
              responsePriceSegment.remainingDeductibleAmount.value = parseFloat(parsingPrice(rs));

            } else {
              rxInfo.paymentInfo.remainingdeductibleamount = parseFloat(parsingPrice(rs));
              responsePriceSegment.remainingDeductibleAmount.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === 'FH') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.amountappliedtoperiodicdeductible = parseFloat(parsingPrice(rs));
              responsePriceSegment.amountAppliedToPeriodicDeductible.value = parseFloat(parsingPrice(rs));
            } else if (rs.length === 2) {
              rxInfo.paymentInfo.amountappliedtoperiodicdeductible = parseFloat(parsingPrice(rs));
              responsePriceSegment.amountAppliedToPeriodicDeductible.value = parseFloat(parsingPrice(rs));
            } else {
              rxInfo.paymentInfo.amountappliedtoperiodicdeductible = parseFloat(parsingPrice(rs));
              responsePriceSegment.amountAppliedToPeriodicDeductible.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === 'U8') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.ingreadientcostcontracted = parseFloat(parsingPrice(rs));
              responsePriceSegment.ingreadientCostContracted.value = parseFloat(parsingPrice(rs));
            } else if (rs.length === 2) {
              rxInfo.paymentInfo.ingreadientcostcontracted = parseFloat(parsingPrice(rs));
              responsePriceSegment.ingreadientCostContracted.value = parseFloat(parsingPrice(rs));
            } else {
              rxInfo.paymentInfo.ingreadientcostcontracted = parseFloat(parsingPrice(rs));
              responsePriceSegment.ingreadientCostContracted.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === 'U9') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.dispensingfeecontracted = parseFloat(parsingPrice(rs));
              responsePriceSegment.dispensingFeeContracted.value = parseFloat(parsingPrice(rs));
            } else if (rs.length === 2) {
              rxInfo.paymentInfo.dispensingfeecontracted = parseFloat(parsingPrice(rs));
              responsePriceSegment.dispensingFeeContracted.value = parseFloat(parsingPrice(rs));
            } else {
              rxInfo.paymentInfo.dispensingfeecontracted = parseFloat(parsingPrice(rs));
              responsePriceSegment.dispensingFeeContracted.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === 'AW') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.flatsalestaxpaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.flatSalesTaxAmountPaid.value = parseFloat(parsingPrice(rs));

            } else if (rs.length === 2) {
              rxInfo.paymentInfo.flatsalestaxpaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.flatSalesTaxAmountPaid.value = parseFloat(parsingPrice(rs));
            } else {
              rxInfo.paymentInfo.flatsalestaxpaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.flatSalesTaxAmountPaid.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === 'AX') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.percentagesalestaxamountpaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.persentageSalesTaxAmountPaid.value = parseFloat(parsingPrice(rs));
            } else if (rs.length === 2) {
              rxInfo.paymentInfo.percentagesalestaxamountpaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.persentageSalesTaxAmountPaid.value = parseFloat(parsingPrice(rs));
            } else {
              rxInfo.paymentInfo.percentagesalestaxamountpaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.persentageSalesTaxAmountPaid.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === 'AY') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.percentagesalestaxratepaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.percentageSalesTaxRatePaid.value = parseFloat(parsingPrice(rs));
            } else if (rs.length === 2) {
              rxInfo.paymentInfo.percentagesalestaxratepaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.percentageSalesTaxRatePaid.value = parseFloat(parsingPrice(rs));
            } else {
              rxInfo.paymentInfo.percentagesalestaxratepaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.percentageSalesTaxRatePaid.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === 'AZ') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.percentagesalestaxbasispaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.percentageSalesTaxBasisPaid.value = parseFloat(parsingPrice(rs));
            } else if (rs.length === 2) {
              rxInfo.paymentInfo.percentagesalestaxbasispaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.percentageSalesTaxBasisPaid.value = parseFloat(parsingPrice(rs));
            } else {
              rxInfo.paymentInfo.percentagesalestaxbasispaid = parseFloat(parsingPrice(rs));
              responsePriceSegment.percentageSalesTaxBasisPaid.value = parseFloat(parsingPrice(rs));
            }
          } else if (rs.substring(0, 2) === 'AV') {
            rs = rs.substring(2);
            if (rs.length === 1) {
              rxInfo.paymentInfo.taxexemtindicator = parseFloat(parsingPrice(rs));
              responsePriceSegment.taxExemptIndicator.value = parseFloat(parsingPrice(rs));
            } else if (rs.length === 2) {
              rxInfo.paymentInfo.taxexemtindicator = parseFloat(parsingPrice(rs));
              responsePriceSegment.taxExemptIndicator.value = parseFloat(parsingPrice(rs));
            } else {
              rxInfo.paymentInfo.taxexemtindicator = parseFloat(parsingPrice(rs));
              responsePriceSegment.taxExemptIndicator.value = parseFloat(parsingPrice(rs));
            }
          }
        }


        let responseObject = {
          'request': {
            //'rxnumber': claimB1Data.ServiceReferenceNumber,
            'sent': claimsData,
            'RequestArray': requestArray
          },
          'claimStatus': dataResponse,
          'Response': {
            //RESPONSE HEADER SEGMENT
            'ResponseHeaderSegment': {
              'ResponseString': data,
              'ResponseArray': responsingArray,
              'ResponseParsing': rxInfo,
              'Header': responseString
            },
            //RESPONSE MESSAGE SEGMENT
            'ResponseMessageSegment': {
              'SegmentIdentification': responseArray[1],
              'Message': responseArray[2],
            },
            //TRANSACTION RESPONSE STATUS SEGMENT
            'TransactionResponseStatusSegment': {
              'SegmentIdentification': responseArray[3],
              'TransactionResponseStatus': responseArray[4],
              'RejectCount': responseArray[5],
              'RejectCode': responseArray[6],
              'HelpDeskPhoneNumberQualifier': responseArray[7],
              'HelpDeskPhoneNumber': responseArray[8],
            },
            //RESPONSE CLAIM SEGMENT
            'ResponseClaimSegment': {
              'SegmentIdentification': responseArray[9],
              'PrescriptionOrServiceReferenceNumberQualifier': responseArray[10],
              'PerscriptonOrServiceNumber': responseArray[11],
              'PreferredProductCount': responseArray[12],
              'PreferredProductIdQualifier': responseArray[13],
              'PreferredProductId': responseArray[14],
              'PreferredProductIncentive': responseArray[15]
            }
          }
        };

        resolve(responseObject);

      }
    });


  });

}


function parsingPrice(rs) {
  let temp = '';
  if (rs.length === 1) {
    temp = rs;
  } else if (rs.length === 2) {
    temp = rs.substring(1);
  } else {
    temp = rs.substring(rs.length - 2).charAt(1);
  }
  switch (temp) {
    case '{':
      if (rs.length === 1) {
        return '0.00';
      } else if (rs.length === 2) {
        return '0.' + rs.substring(0, 1) + '0';
      } else {
        return rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '0';
      }
    case '}':
      if (rs.length === 1) {
        return '-0.00';
      } else if (rs.length === 2) {
        return '-0.' + rs.substring(0, 1) + '0';
      } else {
        return '-' + rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '0';
      }
    case 'A':
      if (rs.length === 1) {
        return '0.01';
      } else if (rs.length === 2) {
        return '0.' + rs.substring(0, 1) + '1';
      } else {
        return rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '1';
      }
    case 'B':
      if (rs.length === 1) {
        return '0.02';
      } else if (rs.length === 2) {
        return '0.' + rs.substring(0, 1) + '2';
      } else {
        return rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '2';
      }
    case 'C':
      if (rs.length === 1) {
        return '0.03';
      } else if (rs.length === 2) {
        return '0.' + rs.substring(0, 1) + '3';
      } else {
        return rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '3';
      }
    case 'D':
      if (rs.length === 1) {
        return '0.04';
      } else if (rs.length === 2) {
        return '0.' + rs.substring(0, 1) + '4';
      } else {
        return rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '4';
      }
    case 'E':
      if (rs.length === 1) {
        return '0.05';
      } else if (rs.length === 2) {
        return '0.' + rs.substring(0, 1) + '5';
      } else {
        return rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '5';
      }

    case 'F':
      if (rs.length === 1) {
        return '0.06';
      } else if (rs.length === 2) {
        return '0.' + rs.substring(0, 1) + '6';
      } else {
        return rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '6';
      }
    case 'G':
      if (rs.length === 1) {
        return '0.07';
      } else if (rs.length === 2) {
        return '0.' + rs.substring(0, 1) + '6';
      } else {
        return rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '7';
      }
    case 'H':
      if (rs.length === 1) {
        return '0.08';
      } else if (rs.length === 2) {
        return '0.' + rs.substring(0, 1) + '8';
      } else {
        return rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '8';
      }
    case 'I':
      if (rs.length === 1) {
        return '0.09';
      } else if (rs.length === 2) {
        return '0.' + rs.substring(0, 1) + '9';
      } else {
        return rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '9';
      }

    case 'J':
      if (rs.length === 1) {
        return '-0.01';
      } else if (rs.length === 2) {
        return '-0.' + rs.substring(0, 1) + '1';
      } else {
        return '-' + rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '1';
      }
    case 'K':
      if (rs.length === 1) {
        return '-0.02';
      } else if (rs.length === 2) {
        return '-0.' + rs.substring(0, 1) + '2';
      } else {
        return '-' + rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '2';
      }
    case 'L':
      if (rs.length === 1) {
        return '-0.03';
      } else if (rs.length === 2) {
        return '-0.' + rs.substring(0, 1) + '3';
      } else {
        return '-' + rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '3';
      }
    case 'M':
      if (rs.length === 1) {
        return '-0.04';
      } else if (rs.length === 2) {
        return '-0.' + rs.substring(0, 1) + '4';
      } else {
        return '-' + rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '4';
      }
    case 'N':
      if (rs.length === 1) {
        return '-0.05';
      } else if (rs.length === 2) {
        return '-0.' + rs.substring(0, 1) + '5';
      } else {
        return '-' + rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '5';
      }

    case 'O':
      if (rs.length === 1) {
        return '-0.06';
      } else if (rs.length === 2) {
        return '-0.' + rs.substring(0, 1) + '6';
      } else {
        return '-' + rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '6';
      }
    case 'P':
      if (rs.length === 1) {
        return '-0.07';
      } else if (rs.length === 2) {
        return '-0.' + rs.substring(0, 1) + '6';
      } else {
        return '-' + rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '7';
      }
    case 'Q':
      if (rs.length === 1) {
        return '-0.08';
      } else if (rs.length === 2) {
        return '-0.' + rs.substring(0, 1) + '8';
      } else {
        return '-' + rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '8';
      }
    case 'R':
      if (rs.length === 1) {
        return '-0.09';
      } else if (rs.length === 2) {
        return '-0.' + rs.substring(0, 1) + '9';
      } else {
        return '-' + rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '9';
      }
    default:
      if (rs.length === 1) {
        return '0.00';
      } else if (rs.length === 2) {
        return '0.' + rs.substring(0, 1) + '0';
      } else {
        return rs.substring(0, rs.length - 2) + '.' + rs.substring(rs.length - 2).charAt(0) + '0';
      }
  }
}


function ResponseString(str) {
  if (str !== null) {
    str = replaceAll(str, '\u001e', '');
    str = replaceAll(str, '\u001d', '');
    str = replaceAll(str, '\u0002', '');
    str = replaceAll(str, '\u0003', '');
    return str;
  } else {
    return 'Response is null';
  }
}


function headerLength(header) {
  let hedlength = header.length;
  return hedlength.toString();
}


function stringReplace(str) {
  str = str.trim();
  str = replaceAll(str, 'Ø', '0');
  str = replaceAll(str, '<1C>', '\u001c');
  str = replaceAll(str, '<1E>', '\u001e');
  str = replaceAll(str, '<1D>', '\u001d');
  return str;
}

function replaceAll(str, find, replace) {
  return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
}
