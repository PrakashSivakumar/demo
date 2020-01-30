// patient-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

module.exports = function (app) {
  const mongoose = require('mongoose');
  //
  // const crypto = require('crypto');
  //
  // const options = {
  //   secret: process.env.SECRET_KEY,
  // };
  //
  // let encrypt = (text) => {
  //   let cipher = crypto.createCipher('aes-256-cbc', options.secret);
  //   let crypted = cipher.update(text, 'utf8', 'hex');
  //   crypted += cipher.final('hex');
  //   return crypted;
  // };
  //
  // let decrypt = (text) => {
  //   if (text === null || typeof text === 'undefined') {
  //     return text;
  //   }
  //   let decipher = crypto
  //     .createDecipher('aes-256-cbc', options.secret);
  //   let dec = decipher.update(text, 'hex', 'utf8');
  //   dec += decipher.final('utf8');
  //   return dec;
  // };

  // const encryptString = {type: String, get: decrypt, set: encrypt};
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const patient = new Schema({
    claimLog_ids: [{type: Schema.ObjectId, ref: 'claimLog'}],
    allergies: [{
      allergyName: String,
      allergyDescription: String,
      allergyClassId: Number,
      id: String
    }],
    name: {
      firstName: {
        type: String,
        required: true,
        lowercase: true,

      },
      middleName: {
        type: String,
        lowercase: true
      },
      lastName: {
        type: String,
        required: true,
        lowercase: true
      },
    },
    contact: {
      phone: String,
      email: String,
      homePhone: String,
    },
    address: {
      patientResidence: String,
      line1: String,
      line2: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
    },
    idCard: [{
      idType: {
        type: String,
      },
      number: {
        type: String,
      },
    }],
    details: {
      isPregnant: String,
      gender: {
        type:String,
        required: true,
        enum: ['Male', 'Female', 'Others', ' '],
      },
      dateOfBirth: {
        type: String,
        required: true
      },
      hippaSignature: String,
      note: String,
    },
    pharmacy: {
      name: String,
      employerId: [{type: String}],
    },
    insurance: [new mongoose.Schema({
      insuranceCode: String,
      homePlan: String,
      eligibilityClarificationCode: String,
      groupNumber: String,
      personCode: String,
      relationship: String,
      medigapId: String,
      medicaidIndicator: String,
      providerAcceptAssignmentIndicator: String,
      cmsPartdqualFacility: String,
      medicaidId: String,
      medicaidAgencyNumber: String,
      insuranceType: String,
      versionOrReleaseNumber: String,
      insuranceName: String,
      processorControlNumber: String,
      binNumber: String,
      serviceProviderId: String,
      dateOfService: String,
      softwareVendorOrCertificationId: String,
      planId: String,
    })],
    hl7: {
      pid: {
        setId: String,
        patientId: String,
        patientIdentifierList: String,
        alternatePid: String,
        //patientName: String,
        mothersMadienName: String,
        //dateTimeOfBirth: String,
        //administrativeSex: String,
        patientAlias: String,
        race: String,
        //patientAddress: String,
        //countryCode: String,
        //phoneNumberHome: String,
        //phoneNumberBusiness: String,
        primaryLanguage: String,
        martialStatus: String,
        religion: String,
        patientAccountNumber: String,
        ssnNumber: String,
        driversLicenseNumber: String,
        mothersIdentifier: String,
        ethnicGroup: String,
        birthPlace: String,
        multipleBirthIndicator: String,
        birthOrder: String,
        citizenship: String,
        veteransMilitaryStatus: String,
        nationality: String,
        patientDeathDateandTime: String,
        patientDeathIndicator: String,
        identityUnkwonIndicator: String,
        identityReliabilityCode: String,
        lastUpdateDateTime: String,
        lastUpdateFacility: String,
        speciesCode: String,
        breedCode: String,
        strain: String,
        productionClasscode: String,
        tribalCitizenship: String,
      },
      nte:{
        setId: String,
        sourceOfComment: String,
        comment: String,
        commentType: String,
      },
      pd1:{
        livingDependency: String,
        livingArrangement: String,
        patientPrimaryFacility: String,
        patientPrimaryCareProviderNameandIDNo: String,
        studentIndicator: String,
        handicap: String,
        livingWillCode: String,
        organDonorCode: String,
        separateBill: String,
        duplicatePatient: String,
        publicityCode: String,
        protectionIndicator: String,
        protectionIndicatorEffectiveDate: String,
        placeofWorship: String,
        advanceDirectiveCode: String,
        immunizationRegistryStatus: String,
        immunizationRegistryStatusEffectiveDate: String,
        publicityCodeEffectiveDate: String,
        militaryBranch: String,
        militaryRankGrade: String,
        militaryStatus: String,
      },
      al1:{
        setId: String,
        allergenTypeCode: String,
        allergenCodeMnemonicDescription: String,
        allergySeverityCode: String,
        allergyReactionCode: String,
        identificationDate: String,
      },
      in1: {
        setId: String,
        insurancePlanID: String,
        insuranceCompanyID: String,
        insuranceCompanyName: String,
        insuranceCompanyAddress: String,
        insuranceCoContactPerson: String,
        insuranceCoPhoneNumber: String,
        groupNumber: String,
        groupName: String,
        insuredsGroupEmpID: String,
        insuredsGroupEmpName: String,
        planEffectiveDate: String,
        planExpirationDate: String,
        authorizationInformation: String,
        planType: String,
        nameOfInsured: String,
        insuredsRelationshipToPatient: String,
        insuredsDateOfBirth: String,
        insuredsAddress: String,
        assignmentOfBenefits: String,
        coordinationOfBenefits: String,
        coordOfBen_Priority: String,
        noticeOfAdmissionFlag: String,
        noticeOfAdmissionDate: String,
        reportOfEligibilityFlag: String,
        reportOfEligibilityDate: String,
        releaseInformationCode: String,
        pre_AdmitCert: String,
        verificationDateTime: String,
        verificationBy: String,
        typeOfAgreementCode: String,
        billingStatus: String,
        lifetimeReserveDays: String,
        delayBeforeL_R_Day: String,
        companyPlanCode: String,
        policyNumber: String,
        policyDeductible: String,
        policyLimit_Amount: String,
        policyLimit_Days: String,
        roomRate_Semi_Private: String,
        roomRate_Private: String,
        insuredsEmploymentStatus: String,
        insuredsAdministrativeSex: String,
        insuredsEmployersAddress: String,
        verificationStatus: String,
        priorInsurancePlanID: String,
        coverageType: String,
        handicap: String,
        insuredsIDNumber: String,
        signatureCode: String,
        signatureCodeDate: String,
        insured_sBirthPlace: String,
        vipIndicator: String,
      }
    }
  }, {
    timestamps: true,
  });

  patient.plugin(mongoosastic,{
    hosts: [
      app.get('elasticSearch')
    ]
  });

  return mongooseClient.model('patient', patient);
};
