// rx-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const mongoosastic = app.get('mongoosastic');

  const {Schema} = mongooseClient;
  const rx = new Schema({
        _id: Schema.ObjectId,
    rxId: {
      type: Number,
    },
    isPriorty: Boolean,
    rxType: {
      type: String,
      // default: 'internal',
      enum: ['internal', 'external', null, '', 'myrx', 'eFax', 'surescripts']
    },
    isActive: {
      type: Schema.ObjectId,
      ref: 'users'
    },
    userDetails: {
      userId: {
        type: Schema.ObjectId,
        ref: 'users'
      },
      userName: String,
    },
    patient_id: {
      type: Schema.ObjectId,
      required: true,
      ref: 'patient',
    },
    productDetails: {
      productName: {
        type: Schema.ObjectId,
        ref: 'gsdd5-product',
      },
      name: String,
      DEAClass: Number
    },
    claimLogs_id: [{
      type: Schema.ObjectId,
      ref: 'claimLog'
    }],
    prescriber_id: {
      type: Schema.ObjectId,
      //required: true,
      ref: 'prescriber',
    },
    prescriberLocationName: String,
    product_id: {
      type: Number
    },
    pharmacy_id: {
      type: Schema.ObjectId,
      ref: 'pharmacy',
    },
    digitalSignature: [String],
    digitalSignVerification: String,
    wetSignature: String,
    image: String,
    refillTrackerQty: Number,
    refillTrackerDescription: String,
    refills: {
      fills: [new Schema({
        daw: Number,
        deleteReason: String,
        unitOfMeasure: String,
        rxOriginCode: String,
        iou: {
          type: Number,
          default: 0,
        },
        billTo: {
          type: String,
        },
        secondIns: String,
        sig: {
          code: {
            type: String,
          },
          description: {
            type: String,
          },
        },
        number: Number,
        quantityDispensed: Number,
        daysSupply: Number,
        usualAndCustomerCharge: Number,
        rxImage: {
          drug: String,
          label: String,
          optional: String,
        },
        checkout_id: {
          type: Schema.ObjectId,
          ref: 'checkout'
        },
        user: {
          username: String,
          lastAction: String,
          dispensingFee: {
            type: Number,
            Default: 5,
          },
        },
        billing: {
          billingType: String,
          insurance: {
            planId: String,
            name: String,
            insurancePaid: Number,
            ingredientCostPaid: Number,
            dispensingFeePaid: Number,
            insurancePaid2: Number,
            ingredientCostPaid2: Number,
            dispensingFeePaid2: Number,
            flatSalesTax: Number,
            salesTaxRate: Number,
            SalesTaxBasis: Number,
            percentOfSalesTax: Number,
          },
          patientPaid: Number,
          patientPaid2:Number,
          acqPrice: Number,
          wac: Number,
          awp: Number,
          awpPrice: Number,
          billed: Number,
          totalPaid: Number,
          profitMargin: Number,
        },
        package: {
          package_id: {
            type: Schema.ObjectId,
            ref: 'package'
          },
          package_priceId: Number,
        },
        amount: {
          cashPrice: Number,
          price: Number,
        },
        reject: {
          comment: String,
          reasonType: String,
        },
        status: {
          type: String,
          // enum: ['Hold', 'Deleted', 'Restocked', 'Billed for Cash', 'Billed for Insurance', 'Refund', 'Unbilled', 'Transfer Out', 'Transfer In', 'Insurance Denied', 'Insurance Reversed', '', null],
        },
        deliveryMethod: String,
        notes: {
          comment: String,
          note: String,
          annotate:String
        },
        orderedQuantity: Number,
        verificationStatus: {
          type: String,
          enum: ['Approved', 'Pending', 'Rejected', 'Sold Out', null, '', 'Unbilled', 'Release', 'Viewed by Patient', 'Verified by Patient', 'Draft', 'Cancelled Rx','Mobileapp Req'],
        },
        fillDate: {
          type: Date,
        }
      }, {
        timestamps: true
      })],
      endRefillDate: String,
      orderDate: Date,
      total: Number,
    },
    transfers: {
      pharmacy_id: {
        from: String,
        to: String,
      },
      transferType: {
        type: String,
        enum: ['Transfer Out', 'Transfer In', null, ''],
      },
      toPharmDetails: {
        toPharmName: String,
        toPharmAddress: String,
        toPharmCity: String,
        toPharmState: String,
        toPharmDeanumber: String,
        toPharmZip: Number,
        toPharmPhone: Number,
        toPharmFax: Number,
        otherPharmacistName: String,
        pharmacistName: String,
      },
      dates: {
        writtenDate: Date,
        firstFillDate: Date,
        lastFillDate: Date,
        transferDate: {
          type: Date,
          default: Date.now(),
        },
      },
      rxNumber: {
        from: Number,
        to: Number,
      },
      remarks: String,

    },
    hl7: {
      hl7String: String,
      msh: {
        fieldSeparator: String,
        encodingCharacters: String,
        sendingApplication: String,
        sendingFacility: String,
        receivingApplication: String,
        receivingFacility: String,
        dateTimeOfMessage: String,
        security: String,
        messageType: String,
        messageControlID: String,
        processingID: String,
        versionID: String,
        sequenceNumber: String,
        continuationPointer: String,
        acceptAcknowledgmentType: String,
        applicationAcknowledgmentType: String,
        countryCode: String,
        characterSet: String,
        principalLanguageOfMessage: String,
        alternateCharacterSetHandlingScheme: String,
        messageProfileIdentifier: String,
      },
      evn: {
        eventTypeCode: String,
        recordedDateTime: String,
        dateTimePlannedEvent: String,
        eventReasonCode: String,
        operatorId: String,
        eventOccurred: String,
        eventFacility: String,
      },
      sft: {
        softwareVendorOrganization: String,
        softwareCertifiedVersionorReleaseNumber: String,
        softwareProductName: String,
        softwareBinaryId: String,
        softwareProductInformation: String,
        softwareInstallDate: String,
      },
      pv1: {
        setID: String,
        patientClass: String,
        assignedPatientLocation: String,
        admissionType: String,
        preadmitNumber: String,
        priorPatientLocation: String,
        attendingDoctor: String,
        referringDoctor: String,
        consultingDoctor: String,
        hospitalService: String,
        temporaryLocation: String,
        preadmitTestIndicator: String,
        re_admissionIndicator: String,
        admitSource: String,
        ambulatoryStatus: String,
        vipIndicator: String,
        admittingDoctor: String,
        patientType: String,
        visitNumber: String,
        financialClass: String,
        chargePriceIndicator: String,
        courtesyCode: String,
        creditRating: String,
        contractCode: String,
        contractEffectiveDate: String,
        contractAmount: String,
        contractPeriod: String,
        interestCode: String,
        transferToBadDebtCode: String,
        transferToBadDebtDate: String,
        badDebtAgencyCode: String,
        badDebtTransferAmount: String,
        badDebtRecoveryAmount: String,
        deleteAccountIndicator: String,
        deleteAccountDate: String,
        dischargeDisposition: String,
        dischargedtoLocation: String,
        dietType: String,
        servicingFacility: String,
        bedStatus: String,
        accountStatus: String,
        pendingLocation: String,
        priorTemporaryLocation: String,
        admitDateTime: String,
        dischargeDateTime: String,
        currentPatientBalance: String,
        totalCharges: String,
        totalAdjustments: String,
        totalPayments: String,
        alternateVisitId: String,
        visitIndicator: String,
        otherHealthcareProvider: String,
        // admissionDate:Date,
        // dischargeDate:Date,
      },
      pv2: {
        priorPendingLocation: String,
        accommodationCode: String,
        admitReason: String,
        transferReason: String,
        patientValuables: String,
        patientValuablesLocation: String,
        visitUserCode: String,
        expectedAdmitDateTime: String,
        expectedDischargeDateTime: String,
        estimatedLengthOfInpatientStay: String,
        actualLengthOfInpatientStay: String,
        visitDescription: String,
        referralSourceCode: String,
        previousServiceDate: String,
        employmentIllnessRelatedIndicator: String,
        purgeStatusCode: String,
        purgeStatusDate: String,
        specialProgramCode: String,
        retentionIndicator: String,
        expectedNumberofInsurancePlans: String,
        visitPublicityCode: String,
        visitProtectionIndicator: String,
        clinicOrganizationName: String,
        patientStatusCode: String,
        visitPriorityCode: String,
        previousTreatmentDate: String,
        expectedDischargeDisposition: String,
        signatureonFileDate: String,
        firstSimilarIllnessDate: String,
        patientChargeAdjustmentCode: String,
        recurringServiceCode: String,
        billingMediaCode: String,
        expectedSurgeryDateandTime: String,
        militaryPartnershipCode: String,
        militaryNon_AvailabilityCode: String,
        newbornBabyIndicator: String,
        babyDetainedIndicator: String,
        modeofArrivalCode: String,
        recreationalDrugUseCode: String,
        admissionLevelofCareCode: String,
        precautionCode: String,
        patientConditionCode: String,
        livingWillCode: String,
        organDonorCode: String,
        advanceDirectiveCode: String,
        patientStatusEffectiveDate: String,
        expectedLOAReturnDateTime: String,
        expectedPre_admissionTestingDateTime: String,
        notifyClergyCode: String,
      },
      orc: {
        orderControl: String,
        placerOrderNumber: String,
        fillerOrderNumber: String,
        placerGroupNumber: String,
        orderStatus: String,
        responseFlag: String,
        quantityTiming: String,
        parentOrder: String,
        dateTimeofTransaction: String,
        enteredBy: String,
        verifiedBy: String,
        //orderingProvider: String,
        enterersLocation: String,
        callBackPhoneNumber: String,
        orderEffectiveDateTime: String,
        orderControlCodeReason: String,
        enteringOrganization: String,
        enteringDevice: String,
        actionBy: String,
        advancedBeneficiaryNoticeCode: String,
        orderingFacilityName: String,
        orderingFacilityAddress: String,
        orderingFacilityPhoneNumber: String,
        orderingProviderAddress: String,
        orderStatusModifier: String,
        advancedBeneficiaryNoticeOverrideReason: String,
        fillersExpectedAvailabilityDateTime: String,
        confidentialityCode: String,
        orderType: String,
        entererAuthorizationMode: String,
        parentUniversalServiceIdentifier: String,

      },
      rxe: {
        quantityTiming: String,
        giveCode: String,
        giveAmountMinimum: String,
        giveAmountMaximum: String,
        giveUnits: String,
        giveDosageForm: String,
        //providersAdministrationInstructions: String,
        deliverToLocation: String,
        substitutionStatus: String,
        dispenseAmount: String,
        dispenseUnits: String,
        numberOfRefills: String,
        orderingProvidersDEANumber: String,
        pharmacistTreatmentSuppliersVerifierId: String,
        prescriptNumber: String,
        numberOfRefillsRemaining: String,
        numberOfRefillsDosesDispensed: String,
        dtOfMostRecentRefillOrDoseDispensed: String,
        totalDailyDose: String,
        needsHumanReview: String,
        pharmacyTreatmentSuppliersSpecialDispensingInstructions: String,
        givePer: String,
        giveRateAmount: String,
        giveRateUnits: String,
        giveStrength: String,
        giveStrengthUnits: String,
        giveIndication: String,
        dispensePackageSize: String,
        dispensePackageSizeUnit: String,
        dispensePackageMethod: String,
        supplementaryCode: String,
        originalOrderDateTime: String,
        giveDrugStrenthVolume: String,
        giveDrugStrengthVolumeUnits: String,
        controlledSubstanceSchedule: String,
        formularyStatus: String,
        pharmaceuticalSubstanceAlterenative: String,
        pharmacyOfMostRecentFill: String,
        initialDispenseAmount: String,
        dispensingPharmacy: String,
        dispensingPharmacyAddress: String,
        deliverToPatientLocation: String,
        deliverToAddress: String,
        pharmacyOrderType: String,
      },
      rxd: {
        dispenseSubIdCounter: String,
        dispenseGiveCode: String,
        dateTimeDispensed: String,
        actualDispenseAmount: String,
        actualDispenseUnits: String,
        actualDosageForm: String,
        prescriptionNumber: String,
        numberOfRefillsRemaining: String,
        dispenseNotes: String,
        dispensingProvider: String,
        substitutionStatus: String,
        totalDailyDose: String,
        dispenseToLocation: String,
        needsHumanReview: String,
        pharmacyTreatmentSuppliersSpecialDispensingInstructions: String,
        actualStrength: String,
        actualStrengthUnit: String,
        substanceLotNumber: String,
        substanceExpirationDate: String,
        substanceManufactureName: String,
        indication: String,
        dispensePackageSizeUnit: String,
        dispensePackageMethod: String,
        supplementaryCode: String,
        initiatingLocation: String,
        packagingAssemblyLocation: String,
        actualDrugStrengthVolume: String,
        actualDrugStrengthVolumeUnits: String,
        dispenseToPharmacy: String,
        dispenseToPharmacyAddress: String,
        pharmacyOrderType: String,
        dispensingType: String,
      },
      obr: {
        setId: String,
        placeOrderNumber: String,
        fillerOrderNumber: String,
        universalServiceIdentifier: String,
        priority_OBR: String,
        requestedDate: Date,
        observationDate: Date,
        observationEndDate: Date,
        collectionVolume: String,
        collectorIdentifier: String,
        specimenActionCode: String,
        dangerCode: String,
        relevantClinicalInformation: String,
        specimenReceivedDate: String,
        specimenSource: String,
        //orderingProvider: String,
        orderCallbackPhoneNumber: String,
        placerField1: String,
        placerField2: String,
        fillerField1: String,
        fillerField2: String,
        resultsRptStatusChng_Date: String,
        chargeToPractice: String,
        diagnosticServSectId: String,
        resultStatus: String,
        parentResult: String,
        quantityTiming: String,
        resultCopiesTo: String,
        parentNumber: String,
        transportationMode: String,
        reasonForStudy: String,
        principalResultInterpreter: String,
        assistantResultInterpreter: String,
        technician: String,
        transcriptionist: String,
        scheduledDateTime: String,
        numberOfSampleContainers: String,
        transportLogisticsOfCollectedSample: String,
        collectorsComment: String,
        transportArrangementResponsibility: String,
        transportArranged: String,
        escortRequired: String,
        plannedPatientTransportComment: String,
        procedureCode: String,
        procedureCodeModifier: String,
        placerSupplementalServiceInformation: String,
        fillerSupplementalServiceInformation: String,
        medicallyNecessaryDuplicateProcedureReason: String,
        resultHandling: String,
        parentUniversalServiceIdentifier: String,
      },
      obx: {
        setId: String,
        valueType: String,
        observationIdentifier: String,
        observationSubId: String,
        observationValue: String,
        units: String,
        referencesRanges: String,
        abnormalFlags: String,
        probability: String,
        natureOfAbnormalTest: String,
        observationResultStatus: String,
        effectiveDateOfReferenceRange: String,
        userDefinedAccessChecks: String,
        dateTimeOfTheObservation: String,
        producersId: String,
        responsibleObserver: String,
        observationMethod: String,
        equipmentInstanceIdentifier: String,
        dateTimeOfTheAnalysis: String,
        reservedForV2_6: String,
        reservedForV2_6_1: String,
        reservedForV2_6_2: String,
        performingOrganizationName: String,
        performingOrganizationAddress: String,
        performingOrganicationMedicalDirector: String,
      },
      nte: {
        setId: String,
        sourceOfComment: String,
        comment: String,
        commentType: String
      },
      nk1: {
        setId: String,
        nkName: String,
        relationship: String,
        address: String,
        phoneNumber: String,
        businessPhoneNumber: String,
        contactRole: String,
        startDate: Date,
        endDate: Date,
        nextOfKinAssociatedPartiesJobTitle: String,
        nextOfKinAssociatedPartiesJobCodeClass: String,
        nextOfKinAssociatedPartiesEmployeeNumber: String,
        organizationNameNK1: String,
        martialStatus: String,
        administrativeSex: String,
        dateTimeOfBirth: String,
        livingDependency: String,
        ambulatoryStatus: String,
        citizenship: String,
        primaryLanguage: String,
        livingArrangement: String,
        publicityCode: String,
        protectionIndicator: String,
        studentIndicator: String,
        religion: String,
        mothersMaidenName: String,
        nationality: String,
        ethnicGroup: String,
        contactReason: String,
        contactPersonsName: String,
        contactPersonsTelephoneNumber: String,
        contactPersonsAddress: String,
        nextOfKinAssociatedPartysIdentifiers: String,
        jobStatus: String,
        race: String,
        handicap: String,
        contactPersonSocialSecurityNumber: String,
        nextOfKinBirthPlace: String,
        vipIndicator: String,
      },
      tq1: {
        setId: String,
        quantity: String,
        repeatPattern: String,
        explicitTime: String,
        relativeTimeAndUnits: String,
        serviceDuration: String,
        startDateTtime: String,
        endDateTime: String,
        priority: String,
        conditionText: String,
        textInstruction: String,
        conjunction: String,
        occurrenceDuration: String,
        totalOccurrences: String,
      },
      tq2: {
        setId: String,
        sequenceResultsFlag: String,
        relatedPlacerNumber: String,
        relatedFillerNumber: String,
        relatedPlacerGroupNumber: String,
        sequenceConditionCode: String,
        cyclicEntryExitIndicator: String,
        sequenceConditionTimeInterval: String,
        cyclicGroupMaximumNumberOfRepeats: String,
        specialServiceRequestRelationship: String,

      },
      ft1: {
        setId: String,
        transactionId: String,
        transactionBatchId: String,
        transactionDate: Date,
        transactionPostingDate: Date,
        transactionType: String,
        transactionCode: String,
        transactionDescription: String,
        transactionDescriptionAlt: String,
        transactionQuantity: String,
        transactionAmountExtended: String,
        transactionAmountUnit: String,
        departmentCode: String,
        insurancePlanId: String,
        insuranceAmount: String,
        assignedPatientLocation: String,
        feeSchedule: String,
        patientType: String,
        diagnosisCodeFT1: String,
        performedByCode: String,
        orderedByCode: String,
        unitCost: String,
        fillerOrderNumber: String,
        enteredByCode: String,
        procedureCode: String,
        procedureCodeModifier: String,
        advancedBeneficiaryNoticeCode: String,
        medicallyNecessaryDuplicateProcedureReason: String,
        ndcCode: String,
        paymentReferenceId: String,
        transactionReferenceKey: String,
      },
      cti: {
        sponsorStudyId: String,
        studyPhaseIdentifier: String,
        studyScheduledTimePoint: String,
      },
      ctd: {
        contactRole: String,
        contactName: String,
        contactAddress: String,
        contactLocation: String,
        contactCommunicationInformation: String,
        preferredMethodOfContact: String,
        contactIdentifiers: String,
      },
      spm: {
        setId: String,
        specimentId: String,
        specimenParentIds: String,
        specimenType: String,
        specimenTypeModifier: String,
        specimenAdditives: String,
        specimenCollectionMethod: String,
        specimenSourceSite: String,
        specimenSourceSiteModifier: String,
        specimenCollectionSite: String,
        specimenRole: String,
        specimenCollectionAmount: String,
        groupedSpecimenCount: String,
        specimenDescription: String,
        specimenHandlingCode: String,
        specimenRiskCode: String,
        specimenCollectionDateTime: String,
        specimenReceivedDateTime: String,
        specimenExpirationDateTime: String,
        specimenAvailability: String,
        specimenRejectReason: String,
        specimenQuality: String,
        specimenAppropriateness: String,
        specimenCondition: String,
        specimenCurrentQuantity: String,
        numberofSpecimenContainers: String,
        containerType: String,
        containerCondition: String,
        specimenChildRole: String,
      },
      dsc: {
        continuationPointer: String,
        continuationStyle: String
      }
    },

  }, {
    timestamps: true,
  });


  rx.plugin(mongoosastic, {
    hosts: [
      app.get('elasticSearch')
    ]
  });
  return mongooseClient.model('rx', rx);
};
