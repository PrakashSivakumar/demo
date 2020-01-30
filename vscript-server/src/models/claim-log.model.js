// claimLog-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const claimLog = new Schema({
    userId: {
      type: Schema.ObjectId,
      ref: 'users'
    },
    rxNumber: Number,
    request: {
      requestData: String,
      headerSegment: {
        binnumber: {value: String, description: String},
        versionorReleaseNumber: {value: String, description: String},
        transactionCode: {value: '', description: String},
        processorControlNumber: {value: String, description: String},
        transactionCount: {value: String, description: String},
        serviceProviderIdQualifier: {value: String, description: String},
        serviceProviderId: {value: String, description: String},
        dateOfService: {value: String, description: String},
        SoftWareVendorID: {value: String, description: String}
      },
      patientSegment: {
        patientIdQualifier: {code: String, value: String, description: String},
        patientId: {code: String, value: String, description: String},
        dateOfBirth: {code: String, value: String, description: String},
        patientGenderCode: {code: String, value: String, description: String},
        patientFirstName: {code: String, value: String, description: String},
        patientLastName: {code: String, value: String, description: String},
        streetAddress: {code: String, value: String, description: String},
        city: {code: String, value: String, description: String},
        state: {code: String, value: String, description: String},
        zipCode: {code: String, value: String, description: String},
        phone: {code: String, value: String, description: String},
        placeofService: {code: String, value: String, description: String},
        email: {code: String, value: String, description: String},
        patientResidence: {code: String, value: String, description: String},
      },
      insuranceSegment: {
        cardholderID: {code: String, value: String, description: String},
        cardholderFirstName: {code: String, value: String, description: String},
        cardholderLastName: {code: String, value: String, description: String},
        homePlan: {code: String, value: String, description: String},
        planId: {code: String, value: String, description: String},
        eligibilityClarificationCode: {code: String, value: String, description: String},
        groupId: {code: String, value: String, description: String},
        personCode: {code: String, value: String, description: String},
        patientRelationship: {code: String, value: String, description: String},
      },

      prescriberSegment: {
        prescriberIdQualifier: {code: String, value: String, description: String},
        prescriberId: {code: String, value: String, description: String},
        prescriberFirstName: {code: String, value: String, description: String},
        prescriberLastName: {code: String, value: String, description: String},
        phone: {code: String, value: String, description: String},
        primaryCareProviderIdQualifier: {code: String, value: String, description: String},
        primaryCareProviderId: {code: String, value: String, description: String},
        primaryCareProviderLastName: {code: String, value: String, description: String},
        street: {code: String, value: String, description: String},
        city: {code: String, value: String, description: String},
        state: {code: String, value: String, description: String},
        zip: {code: String, value: String, description: String},
      },

      claimSegment: {
        serviceReferenceNumberQualifier: {code: String, value: String, description: String},
        serviceReferenceNumber: {code: String, value: String, description: String},
        serviceIDQualifier: {code: String, value: String, description: String},
        productID: {code: String, value: String, description: String},
        ProcedureModifierCodeCount: {code: String, value: String, description: String},
        procedureCodeModifier: {code: String, value: String, description: String},
        quantityDispensed: {code: String, value: String, description: String},
        fillNumber: {code: String, value: String, description: String},
        daysSupply: {code: String, value: String, description: String},
        compoundCode: {code: String, value: String, description: String},
        DAW: {code: String, value: String, description: String},
        dateOfprescription: {code: String, value: String, description: String},
        Refills: {code: String, value: String, description: String},
        submissionClarificationCodeCount: {code: String, value: String, description: String},
        submissionClarificationCode: {code: String, value: String, description: String},
        specialPackagingIndicator: {code: String, value: String, description: String},
        scheduledPrescriptionIdNumber: {code: String, value: String, description: String},
        unitOfMeasure: {code: String, value: String, description: String},
        levelOfSerivce: {code: String, value: String, description: String},
        intermediaryauthorizationtypeid: {code: String, value: String, description: String},
        intermediaryAuthorizationId: {code: String, value: String, description: String},
        pharmacyServiceType: {code: String, value: String, description: String},
        priorAuthNumber: {code: String, value: String, description: String},
        priorAuthorizationCode: {code: String, value: String, description: String},
        prescriptionOriginCode: {code: String, value: String, description: String},
        OriginallyserviceIDqualifier: {code: String, value: String, description: String},
        originallyServiceCode: {code: String, value: String, description: String},
        originallyPrescribedQuantity: {code: String, value: String, description: String},
        otherCoverageCode: {code: String, value: String, description: String},
        patientAssignmentIndicator: {code: String, value: String, description: String},
      },
      priceSegment: {
        ingredientCost: {code: String, value: String, description: String},
        dispensingFee: {code: String, value: String, description: String},
        patientPaidAmountSubmitted: {code: String, value: String, description: String},
        usualAndCustomerCharge: {code: String, value: String, description: String},
        grossAmountDue: {code: String, value: String, description: String},
        basisOfCostDetermination: {code: String, value: String, description: String},
        flatSalesTaxAmountSubmitted: {code: String, value: String, description: String},
        percentageSalesTaxAmountPaid: {code: String, value: String, description: String},
        percentageSalesTaxRatePaid: {code: String, value: String, description: String},
        percentageSalesTaxBasisPaid: {code: String, value: String, description: String},
      },
      DURPPSsegment: {
        DUROrPPSCodeCounter: {code: String, value: String, description: String},
        reasonForServiceCode: {code: String, value: String, description: String},
        professionalServiceCode: {code: String, value: String, description: String},
        resultOfServiceCode: {code: String, value: String, description: String},
        DURCoAgentIDQualifier: {code: String, value: String, description: String},
        DURCoAgentID: {code: String, value: String, description: String},
      },
      otherPayerSegment: {
        otherPaymentsCount: {code: String, value: String, description: String},
        otherpayercoveragetype: {code: String, value: String, description: String},
        otherPayerIDQualifier: {code: String, value: String, description: String},
        otherpayerid: {code: String, value: String, description: String},
        otherPayerDate: {code: String, value: String, description: String},
        otherPayerPatientAmountCount: {code: String, value: String, description: String},
        otherPayerPatientAmountQualifier: {code: String, value: String, description: String},
        otherPayerPatientAmount: {code: String, value: String, description: String},
        benefitStageCount: {code: String, value: String, description: String},
        benfitStageQualifier: {code: String, value: String, description: String},
        benfitStageAmount: {code: String, value: String, description: String},
      },

    },
    response: {
      responseData: String,
      responseHeaderSegment: {
        versionorReleaseNumber: {code: String, value: String, description: String},
        transactionCode: {code: String, value: String, description: String},
        transactionCount: {code: String, value: String, description: String},
        serviceProviderIdQualifier: {code: String, value: String, description: String},
        serviceProviderId: {code: String, value: String, description: String},
        dateOfService: {code: String, value: String, description: String},
      },
      statusSegment: {
        responseStatus: {code: String, value: String, description: String},
        authorizationNumber: {code: String, value: String, description: String},
        additionalMessageCount: {code: String, value: String, description: String},
        additionalMessageQualifier: {code: String, value: String, description: String},
        additionalMessage: {code: String, value: String, description: String},
        helpDeskNumber: {code: String, value: String, description: String},
        rejectCount: {code: String, value: String, description: String},
        rejectCode: {code: String, value: String, description: String},
      },
      responseClaimSegment: {
        serviceNumberQualifier: {code: String, value: String, description: String},
        serviceNumber: {code: String, value: String, description: String},
        productCount: {code: String, value: String, description: String},
        productID: {code: String, value: String, description: String},
      },
      responsePriceSegment: {
        patientPay: {code: String, value: String, description: String},
        ingredientCostPaid: {code: String, value: String, description: String},
        dispensingFeePaid: {code: String, value: String, description: String},
        taxExemptIndicator: {code: String, value: String, description: String},
        amountAttributed: {code: String, value: String, description: String},
        otherAmountPaidCount: {code: String, value: String, description: String},
        otherAmountPaidQualifier: {code: String, value: String, description: String},
        otherAmountPaid: {code: String, value: String, description: String},
        basisofreimburementdetermination: {code: String, value: String, description: String},
        amountAttributedToSalesTax: {code: String, value: String, description: String},
        amountOfCopay: {code: String, value: String, description: String},
        flatSalesTaxAmountPaid: {code: String, value: String, description: String},
        patientSalesTaxAmount: {code: String, value: String, description: String},
        insentiveFee: {code: String, value: String, description: String},
        amountOfCoInsurance: {code: String, value: String, description: String},
        benefitStageAmount: {code: String, value: String, description: String},
        persentageSalesTaxAmountPaid: {code: String, value: String, description: String},
        percentageSalesTaxRatePaid: {code: String, value: String, description: String},
        percentageSalesTaxBasisPaid: {code: String, value: String, description: String},
        amountAttributedToCoverageGap: {code: String, value: String, description: String},
        accumulatedDeductibleAmount: {code: String, value: String, description: String},
        remainingDeductibleAmount: {code: String, value: String, description: String},
        amountAppliedToPeriodicDeductible: {code: String, value: String, description: String},
        ingreadientCostContracted: {code: String, value: String, description: String},
        dispensingFeeContracted: {code: String, value: String, description: String},
      },
    },
    rejectReason: String,
    status: String,
    type: String,
    fqMessage: [String],
  }, {
    timestamps: true,
  });

  claimLog.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });


  return mongooseClient.model('claimLog', claimLog);
};
