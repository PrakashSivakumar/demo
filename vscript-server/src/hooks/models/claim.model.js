class Claim {

  constructor(data = {}) {

    // Header Segment
    console.log(data);
    this.binNumber = data.insurance.binNumber;
    this.secondBinNumber = data.secondInsurance ? data.secondInsurance.binNumber : '';
    this.versionNumber = 'D0'; //data.VersionOrReleaseNumber;
    this.transactionCode = (data.claimControl.type === 'b21' || data.claimControl.type === 'b22' || data.claimControl.type === 'b23')
      ? 'B2' : ((data.claimControl.type === 'eligibility') ? 'E1' : 'B1');
    this.processControlNumber = data.insurance.processorControlNumber.toString().padEnd(10);
    this.secondProcessControlNumber = data.secondInsurance ? data.secondInsurance.processorControlNumber.toString().padEnd(10) : ''
    this.transactionCount = '1';
    this.serviceProviderIdQualifier = '01';
    this.serviceProviderId = '6501121118     ';
    this.dateofServices = this.formatDate(data.refills.fills[0].fillDate);
    this.softwareVendorOrCertificationID = 'D012000211';

    // PatientSegment-AM01
    this.dateOfBirth = this.formatDate(data.patient.details.dateOfBirth);// C4
    this.patientGenderCode = (data.patient.details.gender === 'Male') ? '1' : '2'; // C5
    this.patientFirstName = data.patient.name.firstName.toUpperCase(); // CA
    this.patientLastName = data.patient.name.lastName.toUpperCase(); // CB
    this.patientStreetAddress = data.patient.address.line1.toUpperCase(); // CM
    this.patientCityAddress = data.patient.address.city.toUpperCase();  // CN
    this.patientStateOrProvienceAddress = data.patient.address.state.toUpperCase(); // CO
    this.patientZipOrPostalZone = data.patient.address.zipCode;  // CP
    this.patientPhoneNumber = data.patient.contact.phone; // CQ
    this.employerID = data.patient.idCard.number; // CZ
    this.patientLocation = data.claimControl.patientSegment.patientLocation;
    this.placeofservice = data.claimControl.patientSegment.placeofService;
    this.patientResidence = data.claimControl.patientSegment.patientResidence;
    this.patientEmailAddress = data.patient.contact.email.toUpperCase(); // HN

    // InsuranceSegment-AM04
    this.cardholderID = data.insurance.insuranceCode; // C2
    this.secondCardHolderId = data.secondInsurance ? data.secondInsurance.insuranceCode : '';
    this.groupID = data.insurance.groupNumber; // C1
    this.secondGroupId = data.secondInsurance ? data.secondInsurance.groupNumber : '';
    this.personCode = data.insurance.personCode; // C3
    this.patientRelationShipCode = (data.insurance.relationship === 'cardholder') ? '1' : '2'; // C6
    this.patientIdQualifier = '99'; //data.insurance.idType; // CX
    this.patientId = data.patient.idCard.number; //'ABCD1234'
      this.smokerorNonSmokerCode = '2';
    this.homePlan = data.insurance.homePlan;
    this.planId = data.insurance.planId;
    this.eligibilityCode = data.insurance.eligibilityClarificationCode;
    this.personCode = data.insurance.personCode;
    this.Medigapid = data.insurance.medigapId;
    this.MedicaidIndicator = data.insurance.medicaidIndicator;
    this.ProviderAcceptAssignmentIndicator = data.insurance.providerAcceptAssignmentIndicator;
    this.Cmspartd = data.insurance.cmsPartdqualFacility;
    this.MedicaidIdNumber = data.insurance.medicaidId;

    // Claim Segment-AM07
    // SegmentID="Ø7";
    this.serviceReferenceNumberQualifier = '1';
    this.serviceReferenceNumber = this.rxnumbermodify(data.rxId.toString());
    this.serviceIDQualifier = '03';
    this.serviceID = this.Ndcmodify(data.product.NDC11.toString());
    this.quantityDispensed = data.refills.fills[0].quantityDispensed + '000';
    this.quantityPrescriberDispensed = data.refills.fills[0].orderedQuantity;
    this.fillNumber = data.refills.fills[0].number;
    this.daysSupply = data.refills.fills[0].daysSupply;
    this.compoundCode = '1';
    this.productSelectionCode = data.refills.fills[0].daw;
    this.datePrescriptionWritten = this.formatDate(data.refills.orderDate);
    this.numberOfRefillsAuthorized = data.refills.total;
    this.prescriptionOriginCode = '1';
    this.submissionClarificationCodeCount = data.claimControl.claimSegment.submissionClarificationCodeCount;
    this.submissionClarificationCode = data.claimControl.claimSegment.submissionClarificationCode;
    this.otherCoverageCode = data.claimControl.claimSegment.otherCoverageCode;
    this.specialPackagingIndicator = data.claimControl.claimSegment.specialPackagingIndicator;
    this.unitOfMeasure = data.refills.fills[0].unitOfMeasure; // "EA";
    this.priorAuthorizationCode = data.claimControl.priorAuth.priorAuthorizationCode;
    this.priorAuthorizationNumberSubmitted = data.claimControl.priorAuth.priorAuthorizationNumberSubmitted;
    this.proceduremodifiercodecount = data.claimControl.claimSegment.procedureModifierCodeCount;
    this.proceduremodifiercode = data.claimControl.claimSegment.procedureModifierCode;
    this.scheduledprescriptionidnumber = data.claimControl.insuranceSegment.scheduledPrescriptionIdNumber;
    this.levelofserivce = data.claimControl.claimSegment.levelOfSerivce;
    this.intermediaryauthorizationtypeid = data.claimControl.claimSegment.intermediataryAuthorizationTypeId;
    this.intermediaryAuthorizationId = data.claimControl.claimSegment.intermediataryAuthorizationId;
    this.pharmacyServiceType = data.claimControl.claimSegment.pharmacyServiceType;
    this.originalprescribedqua = data.claimControl.DUR.originalPrescribedQuantity;
    this.originalprescribedid = data.claimControl.DUR.originalPrescribedid;
    this.patientassignmentindicator = data.claimControl.claimSegment.patientassignmentindicator;

    // Pharmacy Segment-AM02
    // SegmentID= "02";
    this.providerIdQualifier = '05';
    this.providerID = '9876543213', //data.prescriber.npi;

      // PrescriberSegment-AM03
      this.prescriberIdQualifier = '01';
    this.prescriberID = data.prescriber.npi;
    this.PrescriberLocationCode = '10';
    this.PrescriberLastName = data.prescriber.name.lastName.toUpperCase();
    this.prescriberfirstname = data.prescriber.name.firstName.toUpperCase();
    this.prescriberstreetaddress = data.prescriber.address.line1.toUpperCase();
    this.prescribercity = data.prescriber.address.city.toUpperCase();
    this.prescriberstate = data.prescriber.address.state.toUpperCase();
    this.prescriberzipcode = data.prescriber.address.zipcode;
    this.primaryCareProviderLocationCode = '101';
    this.phone = data.prescriber.contact.phone;
    this.primaryCareProviderIdQualifier = '12';
    this.primaryCareProviderId = data.prescriber.primaryCareProviderId;
    this.primaryCareProviderLastName = data.prescriber.name.lastName.toUpperCase();
    // PRICING SEGMENT-AM11
    this.ingredientCostSubmitted = this.priceParser(parseFloat(data.refills.fills[0].amount.price).toFixed(2));

    this.dispensingFeeSubmitted = this.priceParser(parseFloat(data.refills.fills[0].user.dispensingFee).toFixed(2));
    this.patientPaidAmountSubmitted = this.priceParser(parseFloat(data.refills.fills[0].billing.patientPaid).toFixed(2));
    this.otherAmountClaimedSubmittedCount = '1';
    this.otherAmountClaimedSubmittedQualifier = '03';
    this.otherAmountClaimedSubmitted = '111I';
    this.usualAndCustomeryCharge = this.priceParser(parseFloat(data.refills.fills[0].amount.price).toFixed(2));
    this.grossAmountDue = this.priceParser(parseFloat(data.refills.fills[0].billing.totalPaid).toFixed(2));
    this.baseOfCastDetermination = data.claimControl.insuranceSegment.basisOfCostDetermination;

    // Other Payments Segment AM05
    this.coordinationOfBenfits = data.claimControl.dulaClaims.coordinationOfBenfits; // 4C
    this.otherPayerCoverageType = data.claimControl.dulaClaims.otherPayerCoverageType; // 5C
    this.otherPayerIDQualifier = data.claimControl.dulaClaims.otherPayerIDQualifier; // 6C
    this.otherPayerID = data.insurance.binNumber; // 7C
    this.otherPayerDate = this.formatDate(data.refills.fills[0].fillDate); // 4b
    this.otherPayerAmountPaidCount = data.claimControl.dulaClaims.otherPayerAmountPaidCount;
    this.otherPayerAmountPaidQualifier = data.claimControl.dulaClaims.otherPayerAmountPaidQualifier;
    this.otherPayerAmountPaid = this.priceParser(data.claimControl.dulaClaims.otherPayerAmountPaid);
    this.otherpayerpatientamountcount = data.claimControl.dulaClaims.otherPayerPatientAmountCount;
    this.otherpayerpatientamountqualifier = '12';
    this.otherpayerpatientamout = this.priceParser(data.claimControl.dulaClaims.otherPayerAmountPaid);
    this.benfitstagecount = '1';
    this.benfitstagequalifier = '03';
    this.benefitstageamount = this.priceParser(parseFloat(data.refills.fills[0].billing.billed).toFixed(2));
    this.incentiveamoutsubmitted = '250{';
    this.flatsalestaxamountsubmitted = ' '; //this.priceParser(data.claimControl.govSegment.flatsalestax);
    this.percentagesalestaxamountsubmitted = ' ';//this.priceParser(data.claimControl.govSegment.percentagesalestaxamount);
    this.percentagesaletaxratesubmitted = this.percentParser(data.claimControl.govSegment.salestaxrate);
    this.percentagesaletaxbasissubmitted = data.claimControl.govSegment.salestaxbasis;
    this.otherPayerCoverageType1 = data.claimControl.dulaClaims.otherPayerCoverageType; // 4c
    this.otherPayerID1 = data.claimControl.dulaClaims.otherPayerID;
    this.otherpayerpatientamountqualifier1 = data.claimControl.dulaClaims.otherPayerAmountPaidQualifier;
    this.otherpayerpatientamout1 = data.claimControl.dulaClaims.otherPayerAmountPaid;

    // DUR/PPS SEGMENT
    this.DUROrPPSCodeCounter = '1';
    this.reasonForServiceCode = data.claimControl.DUR.reasonForServiceCode;
    this.professionalServiceCode = data.claimControl.DUR.professionalServiceCode;
    this.resultOfServiceCode = data.claimControl.DUR.resultOfServiceCode;
    this.DURCo_AgentIDQualifier = data.claimControl.DUR.DURCo_AgentIDQualifier;
    this.DURCo_AgentID = data.claimControl.DUR.DURCo_AgentID;

    // Testcase 9A clinical segment
    this.diagnosiscodecount = data.claimControl.govSegment.diagnosiscodecount;
    this.diagnosiscodequalifier = data.claimControl.govSegment.diagnosiscodequalifier;
    this.diagnosiscode = data.claimControl.govSegment.diagnosiscode;
    this.clinicalinformationcounter = data.claimControl.govSegment.clinicalinformationcounter;
    this.measurementdate = this.formatDate(data.refills.fills[0].fillDate);
    this.measurementtime = '1400';
    this.measurementdimension = data.claimControl.govSegment.measurementdimension;
    this.measurementunit = data.claimControl.govSegment.measurementunit;
    this.measurementvalue = data.claimControl.govSegment.measurementvalue;

    // additional segment
    this.additionaldocumentationtypeid = data.claimControl.govSegment.additionaldocumentationtypeid;
    this.requestperiodbegindate = this.formatDate(data.refills.fills[0].fillDate);
    this.requestperiodrecertdate = this.formatDate(data.refills.fills[0].fillDate);
    this.requeststatus = data.claimControl.govSegment.requeststatus;
    this.lengthofneedqualifier = data.claimControl.govSegment.lengthofneedqualifier;
    this.lengthofneed = data.claimControl.govSegment.lengthofneed;
    this.prescriptiondatesigned = this.formatDate(data.refills.fills[0].fillDate);
    this.supportingdocumentation = data.claimControl.govSegment.supportingdocumentation;
    this.questionnumbercount = data.claimControl.govSegment.questionnumbercount;
    this.questionnumber = data.claimControl.govSegment.questionnumber;
    this.questionpercentresponse = '025000{';
    this.questionnumber2 = data.claimControl.govSegment.questionnumber2;
    this.questiondateresponse = this.formatDate(data.refills.fills[0].fillDate);
    this.questionnumber3 = data.claimControl.govSegment.questionnumber3;
    this.questiondollaramountresponse = '152E';
    this.questionnumber4 = data.claimControl.govSegment.questionnumber4;
    this.questionnumbericresponse = data.claimControl.govSegment.questionnumbericresponse;
    this.questionnumber5 = data.claimControl.govSegment.questionnumber5;
    this.questionalphanumericresponse = data.claimControl.govSegment.questionalphanumericresponse;

    // narrative segment
    this.narrativemessage = data.narrativemessage;
    this.DURCo_AgentID = data.claimControl.DUR.DURCo_AgentID;
    this.drugsList = data.drugList;
    this.facilityId = data.claimControl.vaccine.facilityid;
    this.facilityName = data.claimControl.vaccine.facilityname;
    this.facilityStreetAddress = data.claimControl.vaccine.facilitystreetaddress;
    this.facilityCityAddress = data.claimControl.vaccine.facilitycityaddress;
    this.facilityState = data.claimControl.vaccine.facilitystate;
    this.facilityZip = data.claimControl.vaccine.facilityzip;
  }


  get eligibilityString() {
    return this.binNumber + this.versionNumber + this.transactionCode
      + this.processControlNumber + this.transactionCount + this.serviceProviderIdQualifier
      + this.serviceProviderId + this.dateofServices + this.softwareVendorOrCertificationID
      + '\u001e\u001cAM01\u001cC4' + this.dateOfBirth + '\u001cC5' + this.patientGenderCode
      + '\u001cCA' + this.patientFirstName + '\u001cCB' + this.patientLastName
      + '\u001cCM' + this.patientStreetAddress + '\u001cCN'
      + this.patientCityAddress + '\u001cCO' + this.patientStateOrProvienceAddress
      + '\u001cCP' + this.patientZipOrPostalZone + '\u001cC7' + this.placeofservice;
  }

  get claimB1String() {
    return this.binNumber + this.versionNumber + this.transactionCode + this.processControlNumber + this.transactionCount
      + this.serviceProviderIdQualifier + this.serviceProviderId + this.dateofServices + this.softwareVendorOrCertificationID
      + '\u001e\u001cAM01\u001cCX' + this.patientIdQualifier + '\u001cCY' + this.patientId + '\u001cC4' + this.dateOfBirth
      + '\u001cC5' + this.patientGenderCode + '\u001cCA' + this.patientFirstName + '\u001cCB' + this.patientLastName
      + '\u001cCM' + this.patientStreetAddress + '\u001cCN' + this.patientCityAddress + '\u001cCO' + this.patientStateOrProvienceAddress
      + '\u001cCP' + this.patientZipOrPostalZone + '\u001cCQ' + this.patientPhoneNumber + '\u001cHN' + this.patientEmailAddress
      + '\u001cC7' + this.placeofservice + '\u001c4X' + this.patientResidence
      + '\u001e\u001cAM04\u001cC2' + this.cardholderID + '\u001cCC' + this.patientFirstName + '\u001cCD' + this.patientLastName
      + '\u001cCE' + this.homePlan + '\u001cFO' + this.planId + '\u001cC9' + this.eligibilityCode + '\u001cC1' + this.groupID
      + '\u001cC3' + this.personCode + '\u001cC6' + this.patientRelationShipCode
      + '\u001d\u001e\u001cAM07\u001cEM' + this.serviceReferenceNumberQualifier + '\u001cD2' + this.serviceReferenceNumber
      + '\u001cE1' + this.serviceIDQualifier + '\u001cD7' + this.serviceID + '\u001cE7' + this.quantityDispensed + '\u001cD3' + this.fillNumber
      + '\u001cD5' + this.daysSupply + '\u001cD6' + this.compoundCode + '\u001cD8' + this.productSelectionCode
      + '\u001cDE' + this.datePrescriptionWritten + '\u001cDF' + this.numberOfRefillsAuthorized + '\u001cDJ' + this.prescriptionOriginCode
      + '\u001cMT' + this.patientassignmentindicator + '\u001cU7' + this.pharmacyServiceType
      + '\u001e\u001cAM11\u001cD9' + this.ingredientCostSubmitted + '\u001cDC' + this.dispensingFeeSubmitted
      + '\u001cHE' + this.percentagesaletaxratesubmitted + '\u001cJE' + this.percentagesaletaxbasissubmitted
      + '\u001cDX' + this.patientPaidAmountSubmitted + '\u001cDQ' + this.usualAndCustomeryCharge
      + '\u001cDU' + this.grossAmountDue + '\u001cDN' + '01' + '\u001cE3' + this.incentiveamoutsubmitted + '\u001cH7' + this.otherAmountClaimedSubmittedCount + '\u001cH8' + this.otherAmountClaimedSubmittedQualifier + '\u001cH9' + this.otherAmountClaimedSubmitted
      + '\u001e\u001cAM03\u001cEZ' + this.prescriberIdQualifier + '\u001cDB' + this.prescriberID;
  }

  get claimB1DualString() {
    return this.secondBinNumber + this.versionNumber + this.transactionCode + this.secondProcessControlNumber + this.transactionCount
      + this.serviceProviderIdQualifier + this.serviceProviderId + this.dateofServices + this.softwareVendorOrCertificationID
      + '\u001e\u001cAM01\u001cC4' + this.dateOfBirth + '\u001cC5' + this.patientGenderCode + '\u001cCA' + this.patientFirstName + '\u001cCB' + this.patientLastName
      + '\u001e\u001cAM04\u001cC2' + this.secondCardHolderId + '\u001cC1' + this.secondGroupId + '\u001cC3' + this.personCode + '\u001cC6' + this.patientRelationShipCode
      + '\u001d\u001e\u001cAM07\u001cEM' + this.serviceReferenceNumberQualifier + '\u001cD2' + this.serviceReferenceNumber
      + '\u001cE1' + this.serviceIDQualifier + '\u001cD7' + this.serviceID
      + '\u001cE7' + this.quantityDispensed + '\u001cD3' + this.fillNumber
      + '\u001cD5' + this.daysSupply + '\u001cD6' + this.compoundCode + '\u001cD8' + this.productSelectionCode
      + '\u001cDE' + this.datePrescriptionWritten + '\u001cDF' + this.numberOfRefillsAuthorized + '\u001cDJ' + this.prescriptionOriginCode
      + '\u001cC8' + this.otherCoverageCode
      + '\u001e\u001cAM11\u001cD9' + this.ingredientCostSubmitted + '\u001cDC' + this.dispensingFeeSubmitted
      + '\u001cDQ' + this.usualAndCustomeryCharge + '\u001cDU' + this.grossAmountDue
      + '\u001cDN' + '01'
      + '\u001e\u001cAM05\u001c4C' + '1' + '\u001c5C' + '01'
      + '\u001c6C' + '03' + '\u001c7C' + this.otherPayerID + '\u001cE8' + this.otherPayerDate
      + '\u001cNR' + '01' + '\u001cNP' + '12' + '\u001cNQ' + this.otherpayerpatientamout
      + '\u001cMU' + '1' + '\u001cMV' + '03' + '\u001cMW' + this.benefitstageamount
      + '\u001e\u001cAM03\u001cEZ' + this.prescriberIdQualifier + '\u001cDB' + this.prescriberID;
  }

  get claimB1GovString() {
    return this.claimB1String + '\u001e\u001cAM13\u001cVE' + this.diagnosiscodecount + '\u001cWE' + this.diagnosiscodequalifier + '\u001cDO' + this.diagnosiscode
      + '\u001cXE' + this.clinicalinformationcounter + '\u001cZE' + this.measurementdate + '\u001cH1' + this.measurementtime
      + '\u001cH2' + this.measurementdimension + '\u001cH3' + this.measurementunit + '\u001cH4' + this.measurementvalue
      + '\u001e\u001cAM14\u001c2Q' + this.additionaldocumentationtypeid + '\u001c2V' + this.requestperiodbegindate + '\u001c2W' + this.requestperiodrecertdate
      + '\u001c2U' + this.requeststatus + '\u001c2S' + this.lengthofneedqualifier + '\u001c2R' + this.lengthofneed
      + '\u001c2T' + this.prescriptiondatesigned + '\u001c2X' + this.supportingdocumentation + '\u001c2Z' + this.questionnumbercount
      + '\u001c4B' + this.questionnumber + '\u001c4D' + this.questionpercentresponse + '\u001c4B' + this.questionnumber2
      + '\u001c4G' + this.questiondateresponse + '\u001c4B' + this.questionnumber3 + '\u001c4H' + this.questiondollaramountresponse
      + '\u001c4B' + this.questionnumber4 + '\u001c4J' + this.questionnumbericresponse + '\u001c4B' + this.questionnumber5
      + '\u001c4K' + this.questionalphanumericresponse + '\u001e\u001cAM16\u001cBM' + this.narrativemessage;
  }

  get claimB1GovDualString() {
    return this.claimB1DualString + '\u001e\u001cAM13\u001cVE' + this.diagnosiscodecount + '\u001cWE' + this.diagnosiscodequalifier + '\u001cDO' + this.diagnosiscode
      + '\u001cXE' + this.clinicalinformationcounter + '\u001cZE' + this.measurementdate + '\u001cH1' + this.measurementtime
      + '\u001cH2' + this.measurementdimension + '\u001cH3' + this.measurementunit + '\u001cH4' + this.measurementvalue
      + '\u001e\u001cAM14\u001c2Q' + this.additionaldocumentationtypeid + '\u001c2V' + this.requestperiodbegindate + '\u001c2W' + this.requestperiodrecertdate
      + '\u001c2U' + this.requeststatus + '\u001c2S' + this.lengthofneedqualifier + '\u001c2R' + this.lengthofneed
      + '\u001c2T' + this.prescriptiondatesigned + '\u001c2X' + this.supportingdocumentation + '\u001c2Z' + this.questionnumbercount
      + '\u001c4B' + this.questionnumber + '\u001c4D' + this.questionpercentresponse + '\u001c4B' + this.questionnumber2
      + '\u001c4G' + this.questiondateresponse + '\u001c4B' + this.questionnumber3 + '\u001c4H' + this.questiondollaramountresponse
      + '\u001c4B' + this.questionnumber4 + '\u001c4J' + this.questionnumbericresponse + '\u001c4B' + this.questionnumber5
      + '\u001c4K' + this.questionalphanumericresponse + '\u001e\u001cAM16\u001cBM' + this.narrativemessage;
  }

  get claimB1PriorString() {
    return this.binNumber + this.versionNumber + this.transactionCode + this.processControlNumber + this.transactionCount
      + this.serviceProviderIdQualifier + this.serviceProviderId + this.dateofServices + this.softwareVendorOrCertificationID
      + '\u001e\u001cAM01\u001cCX' + this.patientIdQualifier + '\u001cCY' + this.patientId + '\u001cC4' + this.dateOfBirth
      + '\u001cC5' + this.patientGenderCode + '\u001cCA' + this.patientFirstName + '\u001cCB' + this.patientLastName
      + '\u001cCM' + this.patientStreetAddress + '\u001cCN' + this.patientCityAddress + '\u001cCO' + this.patientStateOrProvienceAddress
      + '\u001cCP' + this.patientZipOrPostalZone + '\u001cCQ' + this.patientPhoneNumber + '\u001cHN' + this.patientEmailAddress
      + '\u001cC7' + this.placeofservice + '\u001c4X' + this.patientResidence
      + '\u001e\u001cAM04\u001cC2' + this.cardholderID + '\u001cCC' + this.patientFirstName + '\u001cCD' + this.patientLastName
      + '\u001cCE' + this.homePlan + '\u001cFO' + this.planId + '\u001cC9' + this.eligibilityCode + '\u001cC1' + this.groupID
      + '\u001cC3' + this.personCode + '\u001cC6' + this.patientRelationShipCode
      + '\u001d\u001e\u001cAM07\u001cEM' + this.serviceReferenceNumberQualifier + '\u001cD2' + this.serviceReferenceNumber
      + '\u001cE1' + this.serviceIDQualifier + '\u001cD7' + this.serviceID + '\u001cSE' + this.proceduremodifiercodecount
      + '\u001cER' + this.proceduremodifiercode + '\u001cE7' + this.quantityDispensed + '\u001cD3' + this.fillNumber
      + '\u001cD5' + this.daysSupply + '\u001cD6' + this.compoundCode + '\u001cD8' + this.productSelectionCode
      + '\u001cDE' + this.datePrescriptionWritten + '\u001cDF' + this.numberOfRefillsAuthorized + '\u001cDJ' + this.prescriptionOriginCode
      + '\u001cNX' + '1' + '\u001cDK' + '01' + '\u001cDT' + this.specialPackagingIndicator
      + '\u001cEK' + this.scheduledprescriptionidnumber + '\u001c28' + 'EA' + '\u001cDI' + this.levelofserivce
      + '\u001cEU' + '01' + '\u001cEV' + '88888888888' + '\u001cEW' + this.intermediaryauthorizationtypeid
      + '\u001cEX' + this.intermediaryAuthorizationId + '\u001cU7' + this.pharmacyServiceType
      + '\u001e\u001cAM02\u001cEY' + this.providerIdQualifier + '\u001cE9' + this.providerID
      + '\u001e\u001cAM03\u001cEZ' + this.prescriberIdQualifier + '\u001cDB' + this.prescriberID + '\u001cDR' + this.PrescriberLastName
      + '\u001cPM' + this.phone + '\u001c2E' + this.primaryCareProviderIdQualifier + '\u001cDL' + this.primaryCareProviderId
      + '\u001c4E' + this.primaryCareProviderLastName + '\u001c2J' + this.prescriberfirstname + '\u001c2K' + this.prescriberstreetaddress
      + '\u001c2M' + this.prescribercity + '\u001c2N' + this.prescriberstate + '\u001c2P' + this.prescriberzipcode
      + '\u001e\u001cAM11\u001cD9' + this.ingredientCostSubmitted + '\u001cDC' + this.dispensingFeeSubmitted
      + '\u001cDX' + this.patientPaidAmountSubmitted + '\u001cDQ' + this.usualAndCustomeryCharge
      + '\u001cDU' + this.grossAmountDue + '\u001cDN' + this.baseOfCastDetermination;
  }

  get claimB1DURString() {
    return this.binNumber + this.versionNumber + this.transactionCode + this.processControlNumber + this.transactionCount
      + this.serviceProviderIdQualifier + this.serviceProviderId + this.dateofServices + this.softwareVendorOrCertificationID
      + '\u001e\u001cAM01\u001cC4' + this.dateOfBirth + '\u001cC5' + this.patientGenderCode + '\u001cCA' + this.patientFirstName + '\u001cCB' + this.patientLastName
      + '\u001e\u001cAM04\u001cC2' + this.cardholderID + '\u001cC1' + this.groupID + '\u001cC3' + this.personCode + '\u001cC6' + this.patientRelationShipCode
      + '\u001d\u001e\u001cAM07\u001cEM' + this.serviceReferenceNumberQualifier + '\u001cD2' + this.serviceReferenceNumber
      + '\u001cE1' + this.serviceIDQualifier + '\u001cD7' + this.serviceID + '\u001cE7' + this.quantityDispensed + '\u001cD3' + this.fillNumber
      + '\u001cD5' + this.daysSupply + '\u001cD6' + this.compoundCode + '\u001cD8' + this.productSelectionCode
      + '\u001cDE' + this.datePrescriptionWritten + '\u001cDF' + this.numberOfRefillsAuthorized + '\u001cDJ' + this.prescriptionOriginCode
      + '\u001cEJ' + '03' + '\u001cEA' + this.originalprescribedid + '\u001cEB' + this.originalprescribedqua
      + '\u001e\u001cAM03\u001cEZ' + this.prescriberIdQualifier + '\u001cDB' + this.prescriberID
      + '\u001e\u001cAM11\u001cD9' + this.ingredientCostSubmitted + '\u001cDC' + this.dispensingFeeSubmitted
      + '\u001cDQ' + this.usualAndCustomeryCharge + '\u001cDU' + this.grossAmountDue + '\u001cDN' + '01'
      + '\u001e\u001cAM08\u001c7E' + '1' + '\u001cE4' + this.reasonForServiceCode + '\u001cE5' + this.professionalServiceCode
      + '\u001cE6' + this.resultOfServiceCode + '\u001cJ9' + '03' + '\u001cH6' + this.DURCo_AgentID;
  }

  get claimB1MultipleDrugs() {
    let multipleDrugs = this.binNumber + this.versionNumber + this.transactionCode + this.processControlNumber + this.transactionCount
      + this.serviceProviderIdQualifier + this.serviceProviderId + this.dateofServices + this.softwareVendorOrCertificationID
      + '\u001e\u001cAM04\u001cC2' + this.cardholderID + '\u001cC1' + this.groupID + '\u001cC301\u001cC6' + this.patientRelationShipCode
      + '\u001e\u001cAM01\u001cC4' + this.dateOfBirth + '\u001cC5' + this.patientGenderCode + '\u001cCA' + this.patientFirstName
      + '\u001cCB' + this.patientLastName
      + '\u001d\u001e\u001cAM07\u001cEM' + this.serviceReferenceNumberQualifier + '\u001cD2' + this.serviceReferenceNumber
      + '\u001cE1' + this.serviceIDQualifier + '\u001cD7' + this.serviceID + '\u001cE7' + this.quantityDispensed + '\u001cD3' + this.fillNumber
      + '\u001cD5' + this.daysSupply + '\u001cD62\u001cD8' + this.productSelectionCode + '\u001cDE' + this.datePrescriptionWritten
      + '\u001cDF' + this.numberOfRefillsAuthorized + '\u001cE226643006\u001cG199' +
      +'\u001e\u001cAM11\u001cD9' + this.ingredientCostSubmitted + '\u001cDC' + this.dispensingFeeSubmitted + '\u001cDQ' + this.usualAndCustomeryCharge
      + '\u001cDU' + this.grossAmountDue + '\u001cDN' + this.baseOfCastDetermination
      + '\u001e\u001cAM03\u001cEZ' + this.prescriberIdQualifier + '\u001cDB' + this.prescriberID
      + '\u001e\u001cAM08\u001c7E' + this.DUROrPPSCodeCounter + '\u001c8E14'
      + '\u001e\u001cAM10\u001cEF15\u001cEG3\u001cEC25';
    for (let drug of this.drugsList) {
      multipleDrugs += '\u001cRE03\u001cTE' + drug.ndc + '\u001cED' + drug.quantity + '\u001cEE' + this.priceParser(drug.compoundDrugCost) + '\u001cUE01';
    }
    multipleDrugs += '\u001c2G01\u001c2HA1';
    return multipleDrugs;
  }

  get claimB1IsVaccine() {
    // this indicates only for 8A Segment
    return this.binNumber + this.versionNumber + this.transactionCode + this.processControlNumber + this.transactionCount
      + this.serviceProviderIdQualifier + this.serviceProviderId + this.dateofServices + this.softwareVendorOrCertificationID
      + '\u001e\u001cAM04\u001cC2' + this.cardholderID + '\u001cC9' + this.eligibilityCode +'\u001cC1' + this.groupID + '\u001cC3' + this.personCode
      + '\u001cC6' + this.patientRelationShipCode + '\u001c2A' + this.Medigapid + '\u001c2B' + this.MedicaidIndicator
      + '\u001c2D' + this.ProviderAcceptAssignmentIndicator + '\u001cG2' + this.Cmspartd + '\u001cN5' + this.MedicaidIdNumber // insurance segment
      + '\u001e\u001cAM01\u001cC4' + this.dateOfBirth + '\u001cC5' + this.patientGenderCode + '\u001cCA' + this.patientFirstName
      + '\u001cCB' + this.patientLastName // patient segment
      + '\u001d\u001e\u001cAM07\u001cEM' + this.serviceReferenceNumberQualifier + '\u001cD2' + this.serviceReferenceNumber
      + '\u001cE1' + this.serviceIDQualifier + '\u001cD7' + this.serviceID + '\u001cE7' + this.quantityDispensed + '\u001cD3' + this.fillNumber
      + '\u001cD5' + this.daysSupply + '\u001cD6' + this.compoundCode + '\u001cD8' + this.productSelectionCode
      + '\u001cDE' + this.datePrescriptionWritten + '\u001cDF' + this.numberOfRefillsAuthorized + '\u001cDJ' + this.prescriptionOriginCode // claims segment
      + '\u001e\u001cAM11\u001cD9' + this.ingredientCostSubmitted +'\u001cDC' + this.dispensingFeeSubmitted + '\u001cE3' + this.incentiveamoutsubmitted + '\u001cDQ' + this.usualAndCustomeryCharge + '\u001cDU' + this.grossAmountDue + '\u001cDN' + this.baseOfCastDetermination // pricing segment
      + '\u001e\u001cAM03\u001cEZ' + this.prescriberIdQualifier + '\u001cDB' + this.prescriberID //  Prescriber segment
      + '\u001e\u001cAM08\u001c7E1\u001cE5MA' // DUR PPS Segment
      + '\u001e\u001cAM15\u001c8C' + this.facilityId + '\u001c3Q' + this.facilityName + '\u001c3U' + this.facilityStreetAddress
      + '\u001c5J' + this.facilityCityAddress + '\u001c3V' + this.facilityState + '\u001c6D' + this.facilityZip; // facility segment
  }

  get claimB21String() {
    return this.binNumber + this.versionNumber + this.transactionCode + this.processControlNumber
      + this.transactionCount + this.serviceProviderIdQualifier + this.serviceProviderId + this.dateofServices + this.softwareVendorOrCertificationID
      + '\u001e\u001cAM04\u001cC2' + this.cardholderID + '\u001cC1' + this.groupID
      + '\u001d\u001e\u001cAM07\u001cEM' + this.serviceReferenceNumberQualifier
      + '\u001cD2' + this.serviceReferenceNumber + '\u001cE1' + this.serviceIDQualifier
      + '\u001cD7' + this.serviceID + '\u001cD3' + this.fillNumber + '\u001cU7' + this.pharmacyServiceType;
  }

  get claimB22String() {
    // if (this.otherPayerCoverageType === `01`) {
    return this.claimB21String + '\u001cC8' + this.otherCoverageCode
      + '\u001e\u001cAM05\u001c4C' + this.otherPayerAmountPaidCount + '\u001c5C' + this.otherPayerCoverageType;

  }

  get claimB23String() {
    // else if (this.OtherPayerCoverageType === `02`) {

    return this.claimB21String + '\u001cC8' + this.otherCoverageCode
      + '\u001e\u001cAM05\u001c4C' + this.otherPayerAmountPaidCount + '\u001c5C' + this.otherPayerCoverageType;

  }


  formatDate(date) {
    let d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return [year, month, day].join('');
  }

  addTranmissionWrapper(type, mode) {
    let addETX = !type.endsWith('\u0003') ? 1 : 0;
    let transmission = '\u0002';
    transmission += (type.length + mode.length + 3 + addETX).toString().padStart(4, '0');
    transmission += mode.length.toString().padStart(3, '0');
    transmission += mode;
    transmission += type;
    if (addETX === 1) {
      transmission += '\u0003';
    }
    // console.log(transmission);
    return transmission;
  }

  priceParser(price) {

    try {
      let prices = parseFloat(price);
      prices = prices.toFixed(2);
      // console.log("After change:", prices);
      let str = String(prices);
      let a = str.split('.');
      let first = a[0];
      let last = a[1];
      if (last.charAt(1) === '0') {
        last = this.replaceAt(last, '{');
        return first + last;
      }
      if (last.charAt(1) === '1') {
        last = this.replaceAt(last, 'A');
        return first + last;
      }
      if (last.charAt(1) === '2') {
        last = this.replaceAt(last, 'B');
        return first + last;
      }
      if (last.charAt(1) === '3') {
        last = this.replaceAt(last, 'C');
        return first + last;
      }
      if (last.charAt(1) === '4') {
        last = this.replaceAt(last, 'D');
        return first + last;
      }
      if (last.charAt(1) === '5') {
        last = this.replaceAt(last, 'E');
        return first + last;
      }
      if (last.charAt(1) === '6') {
        last = this.replaceAt(last, 'F');
        return first + last;
      }
      if (last.charAt(1) === '7') {
        last = this.replaceAt(last, 'G');
        return first + last;
      }
      if (last.charAt(1) === '8') {
        last = this.replaceAt(last, 'H');
        return first + last;
      }
      if (last.charAt(1) === '9') {
        last = this.replaceAt(last, 'I');
        return first + last;
      }
    } catch (error) {
      console.log(error);
    }
  }

  replaceAt(str, char) {
    let string = String(str);
    let arr = string.split('');
    arr[1] = char;
    string = arr.join('');
    return string;
  }

  percentParser(percentage) {
    let percent = parseFloat(percentage).toFixed(4);
    // console.log('percent: ', percent);

    let number = percent * 10000;

    // console.log(number);
    number = Math.ceil(number);
    // console.log('After Floor: ', number);
    let string = number.toString().split('.')[0];
    string = string.padStart(7, '0');

    if (string.endsWith('0')) {
      string = this.replaceLast(string, '{');
      return string;
    }
    if (string.endsWith('1')) {
      string = this.replaceLast(string, 'A');
      return string;
    }
    if (string.endsWith('2')) {
      string = this.replaceLast(string, 'B');
      return string;
    }
    if (string.endsWith('3')) {
      string = this.replaceLast(string, 'C');
      return string;
    }
    if (string.endsWith('4')) {
      string = this.replaceLast(string, 'D');
      return string;
    }
    if (string.endsWith('5')) {
      string = this.replaceLast(string, 'E');
      return string;
    }
    if (string.endsWith('6')) {
      string = this.replaceLast(string, 'F');
      return string;
    }
    if (string.endsWith('7')) {
      string = this.replaceLast(string, 'G');
      return string;
    }
    if (string.endsWith('8')) {
      string = this.replaceLast(string, 'H');
      return string;
    }
    if (string.endsWith('9')) {
      string = this.replaceLast(string, 'I');
      return string;
    }
  }

  replaceLast(str, char) {
    let string = str.toString();
    let arr = string.split('');
    arr[arr.length - 1] = char;
    string = arr.join('');
    return string;
  }

  rxnumbermodify(rxnumber) {
    let rxnum = rxnumber.toString();
    let string = rxnum.split('-')[0];
    string = string.padStart(12, '0');
    return string;
  }

  Ndcmodify(ndc) {
    let NDC11 = ndc.toString();
    let string = NDC11.padStart(11, '0');
    return string;
  }

}

module.exports.Claim = Claim;
