// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function () {
  return context => {
    if (context.path !== 'audit-logs' && context.path !== 'authentication' && context.params.user && context.method !== 'get' && context.method !== 'find') {
      if (context.path === 'users') {
        if (context.method === 'remove') {
          context.app.service('audit-logs').create({
            userId: context.params.user._id,
            pharmacyId: context.params.user.details.pharmacy_id[0],
            username: (context.params.user.username === '') ? 'External User' : context.params.user.username,
            rxId: 'NA',
            patient: 'NA',
            prescriber: 'NA',
            drug: 'NA',
            dea: 'NA',
            messageId: 'NA',
            description: context.params.user.username + ' ' + 'Deleted' + ' ' + context.params.query.userDetails.roles[0] + ': ' + context.params.query.username,
            data: JSON.stringify(context.params.query.userDetails),
            updateFields: 'NA',
            previousValues: 'NA',
            currentValues: 'NA',
            service: context.path,
            method: 'Delete',
            outcome: context.error ? 'Failure' : 'Success'
          }).then(data => {
          }).catch(err => console.log(err));
        } else if (context.method === 'create') {
          console.log('users create', context.params);
          context.app.service('audit-logs').create({
            userId: context.params.user._id,
            pharmacyId: context.params.user.details.pharmacy_id[0],
            username: (context.params.user.username === '') ? 'External User' : context.params.user.username,
            rxId: 'NA',
            patient: 'NA',
            prescriber: 'NA',
            drug: 'NA',
            dea: 'NA',
            messageId: 'NA',
            description: context.params.user.username + ' ' + 'Created' + ' ' + context.params.query.userDetails.roles[0] + ': ' + context.params.query.username,
            data: JSON.stringify(context.params.query.userDetails),
            updateFields: 'NA',
            previousValues: 'NA',
            currentValues: 'NA',
            service: context.path,
            method: 'Create',
            outcome: context.error ? 'Failure' : 'Success'
          }).then(data => {
          }).catch(err => console.log(err));
        } else if (context.method === 'patch' && context.params.query.userPatch === 'userLoginUpdate') {
          let auditData = {
            userId: context.params.user._id,
            pharmacyId: context.params.user.details.pharmacy_id[0],
            username: (context.params.user.username === '') ? 'External User' : context.params.user.username,
            rxId: 'NA',
            patient: 'NA',
            prescriber: 'NA',
            drug: 'NA',
            dea: 'NA',
            messageId: 'NA',
            description: (context.data.isLoggedIn === true) ? context.params.user.username + ' ' + 'Logged In to' + ' ' + context.params.query.userDetails.details.pharmacy.name : context.params.user.username + ' ' + 'Logged Out from' + ' ' + context.params.query.userDetails.details.pharmacy.name,
            data: JSON.stringify(context.params.query.userDetails),
            updateFields: context.params.query.updateFields,
            previousValues: context.params.query.previousValues,
            currentValues: context.params.query.currentValues,
            service: context.path,
            method: (context.data.isLoggedIn === true) ? 'Login' : 'Logout',
            outcome: context.error ? 'Failure' : 'Success'
          }
          context.app.service('audit-logs').create(auditData).then(data => {
          }).catch(err => console.log(err));
        } else if (context.method === 'patch') {
          let auditData = {
            userId: context.params.user._id,
            pharmacyId: context.params.user.details.pharmacy_id[0],
            username: (context.params.user.username === '') ? 'External User' : context.params.user.username,
            rxId: 'NA',
            patient: 'NA',
            prescriber: 'NA',
            drug: 'NA',
            dea: 'NA',
            messageId: 'NA',
            description: context.params.user.username + ' ' + 'Updated' + ' ' + context.params.query.userDetails.roles[0] + ': ' + context.params.query.username,
            data: JSON.stringify(context.params.query.userDetails),
            updateFields: context.params.query.updateFields,
            previousValues: context.params.query.previousValues,
            currentValues: context.params.query.currentValues,
            service: context.path,
            method: 'Update',
            outcome: context.error ? 'Failure' : 'Success'
          }
          context.app.service('audit-logs').create(auditData).then(data => {
          }).catch(err => console.log(err));
        }
      } else if (context.path === 'rx') {
        if (context.method === 'patch') {
          context.app.service('audit-logs').create({
            userId: context.params.user._id,
            pharmacyId: context.params.user.details.pharmacy_id[0],
            username: (context.params.user.username === '') ? 'External User' : context.params.user.username,
            rxId: (context.data.rxPatch === 'rxUpdatation' || context.data.rxPatch === 'rxUpdateSeveral') ? context.data.rxId : ((context.params.query.rxPatch === 'statusToRefund') || (context.params.query.rxPatch === 'rxPending') || (context.params.query.rxPatch === 'rxStatusCancel') || (context.params.query.rxPatch === 'updateCheckoutRx') || (context.params.query.rxPatch === 'rxViewOff') || (context.params.query.rxPatch === 'rxTransfer')) ? ''
              : ((context.params.query.rxPatch === 'rxAnnotate') || (context.params.query.rxPatch === 'rxRelease')) ? context.params.query.rxId
                : context.params.query.rxDetails.rxId,
            patient: (context.data.rxPatch === 'rxUpdatation' || context.data.rxPatch === 'rxUpdateSeveral') ? (context.data.patient.name.firstName + ' ' + context.data.patient.name.lastName) : ((context.params.query.rxPatch === 'statusToRefund') || (context.params.query.rxPatch === 'rxPending') || (context.params.query.rxPatch === 'rxStatusCancel') || (context.params.query.rxPatch === 'rxAnnotate') || (context.params.query.rxPatch === 'updateCheckoutRx') || (context.params.query.rxPatch === 'rxViewOff') || (context.params.query.rxPatch === 'rxTransfer')) ? '' : context.params.query.rxDetails.patient.name.firstName + ' ' + context.params.query.rxDetails.patient.name.lastName,
            prescriber: (context.data.rxPatch === 'rxUpdatation' || context.data.rxPatch === 'rxUpdateSeveral') ? (context.data.prescriber.name.firstName + ' ' + context.data.prescriber.name.lastName) : ((context.params.query.rxPatch === 'statusToRefund') || (context.params.query.rxPatch === 'rxPending') || (context.params.query.rxPatch === 'rxStatusCancel') || (context.params.query.rxPatch === 'rxAnnotate') || (context.params.query.rxPatch === 'updateCheckoutRx') || (context.params.query.rxPatch === 'rxViewOff') || (context.params.query.rxPatch === 'rxTransfer')) ? '' : context.params.query.rxDetails.prescriber.name.firstName + ' ' + context.params.query.rxDetails.prescriber.name.lastName,
            drug: (context.data.rxPatch === 'rxUpdatation' || context.data.rxPatch === 'rxUpdateSeveral') ? (context.data.productDetails.name) : ((context.params.query.rxPatch === 'statusToRefund') || (context.params.query.rxPatch === 'rxPending') || (context.params.query.rxPatch === 'rxStatusCancel') || (context.params.query.rxPatch === 'rxAnnotate') || (context.params.query.rxPatch === 'updateCheckoutRx') || (context.params.query.rxPatch === 'rxViewOff') || (context.params.query.rxPatch === 'rxTransfer')) ? '' : context.params.query.rxDetails.productDetails.name,
            dea: (context.data.rxPatch === 'rxUpdatation' || context.data.rxPatch === 'rxUpdateSeveral') ? (context.data.productDetails.DEAClass) : ((context.params.query.rxPatch === 'statusToRefund') || (context.params.query.rxPatch === 'rxPending') || (context.params.query.rxPatch === 'rxStatusCancel') || (context.params.query.rxPatch === 'rxAnnotate') || (context.params.query.rxPatch === 'updateCheckoutRx') || (context.params.query.rxPatch === 'rxViewOff') || (context.params.query.rxPatch === 'rxTransfer')) ? '' : context.params.query.rxDetails.productDetails.DEAClass,
            messageId: 'NA',
            description: (context.params.query.rxPatch === 'rxViewOff') ? context.params.user.username + ' Viewing Rx State is Closed'
              : (context.params.query.rxPatch === 'rxTransfer') ? context.params.user.username + ' Transferred Rx'
                : (context.params.query.rxPatch === 'rxRecall') ? context.params.user.username + ' Recalled Rx ' + context.params.query.rxDetails.rxId
                  : (context.params.query.rxPatch === 'rxDelete') ? context.params.user.username + ' Deleted Rx ' + context.params.query.rxDetails.rxId
                    : (context.params.query.rxPatch === 'rxCommentUpdation') ? context.params.user.username + ' Updated Comment on Rx ' + context.params.query.rxDetails.rxId
                      : (context.params.query.rxPatch === 'rxNoteUpdation') ? context.params.user.username + ' Updated Notes on Rx ' + context.params.query.rxDetails.rxId
                        : (context.params.query.rxPatch === 'updateCheckoutRx') ? context.params.user.username + ' Checkout on Rx'
                          : (context.params.query.rxPatch === 'rxAnnotate') ? context.params.user.username + ' Annotated the Rx ' + context.params.query.rxId
                            : (context.params.query.rxPatch === 'rxRelease') ? context.params.user.username + ' Released Rx ' + context.params.query.rxId
                              : (context.params.query.rxPatch === 'rxStatusCancel') ? context.params.user.username + ' Updated Verification Status to Cancelled Rx'
                                : (context.params.query.rxPatch === 'rxPending') ? context.params.user.username + 'Updated Verification Status to Pending'
                                  : (context.params.query.rxPatch === 'rxVerificationStatus') ? context.params.user.username + 'Updated Rx ' + context.params.query.rxDetails.rxId + ' Verification Status to Viewed By Patient'
                                    : (context.params.query.rxPatch === 'statusToRefund') ? context.params.user.username + 'Updated Rx Status to Refund'
                                      : (context.params.query.rxPatch === 'rxViewOn') ? context.params.user.username + ' Viewing Rx ' + context.params.query.rxDetails.rxId + ' State is Open'
                                        : (context.data.rxPatch === 'rxUpdatation' || context.data.rxPatch === 'rxUpdateSeveral') ? context.params.user.username + ' Updated Rx ' + context.data.rxId
                                          : context.params.user.username + ' Updated Rx ' + context.params.query.rxDetails.rxId,
            data: (context.data.rxPatch === 'rxUpdatation' || context.data.rxPatch === 'rxUpdateSeveral') ? JSON.stringify(context.data) : ((context.params.query.rxPatch === 'statusToRefund') || (context.params.query.rxPatch === 'rxPending') || (context.params.query.rxPatch === 'rxStatusCancel') || (context.params.query.rxPatch === 'rxAnnotate') || (context.params.query.rxPatch === 'updateCheckoutRx') || (context.params.query.rxPatch === 'rxViewOff') || (context.params.query.rxPatch === 'rxTransfer')) ? '' : JSON.stringify(context.params.query.rxDetails),
            updateFields: (context.data.rxPatch === 'rxUpdatation' || context.data.rxPatch === 'rxUpdateSeveral') ? context.data.updateFields : context.params.query.updateFields,
            previousValues: (context.data.rxPatch === 'rxUpdatation' || context.data.rxPatch === 'rxUpdateSeveral') ? context.data.previousValues : context.params.query.previousValues,
            currentValues: (context.data.rxPatch === 'rxUpdatation' || context.data.rxPatch === 'rxUpdateSeveral') ? context.data.currentValues : context.params.query.currentValues,
            service: context.path,
            method: ((context.params.query.rxPatch === 'rxViewOn') || (context.params.query.rxPatch === 'rxViewOff')) ? 'View' : 'Update',
            outcome: context.error ? 'Failure' : 'Success'
          }).then(data => {
          }).catch(err => console.log(err));
        } else if (context.method === 'create') {
          context.app.service('audit-logs').create({
            userId: context.params.user._id,
            pharmacyId: context.params.user.details.pharmacy_id[0],
            username: (context.params.user.username === '') ? 'External User' : context.params.user.username,
            rxId: context.params.query.rxDetails.rxId,
            patient: context.params.query.rxDetails.patient.name.firstName + ' ' + context.params.query.rxDetails.patient.name.lastName,
            prescriber: context.params.query.rxDetails.prescriber.name.firstName + ' ' + context.params.query.rxDetails.prescriber.name.lastName,
            drug: context.params.query.rxDetails.productDetails.name,
            dea: context.params.query.rxDetails.productDetails.DEAClass,
            messageId: 'NA',
            description: context.params.user.username + ' Created Rx ' + context.params.query.rxDetails.rxId,
            data: JSON.stringify(context.params.query.rxDetails),
            updateFields: ['NA'],
            previousValues: ['NA'],
            currentValues: ['NA'],
            service: context.path,
            method: 'Create',
            outcome: context.error ? 'Failure' : 'Success'
          }).then(data => {
            // context.params.query.viewPage = '';
          }).catch(err => console.log(err));
        }
      } else if (context.path === 'patient') {
        console.log('patientPath', context.data);
        if (context.method === 'create') {
          context.app.service('audit-logs').create({
            userId: context.params.user._id,
            pharmacyId: context.params.user.details.pharmacy_id[0],
            username: (context.params.user.username === '') ? 'External User' : context.params.user.username,
            rxId: 'NA',
            patient: context.params.query.patientDetails.name.firstName + ' ' + context.params.query.patientDetails.name.lastName,
            prescriber: 'NA',
            drug: 'NA',
            dea: 'NA',
            messageId: 'NA',
            description: context.params.user.username + ' Created Patient: ' + context.params.query.patientDetails.name.firstName + ' ' + context.params.query.patientDetails.name.lastName + ' On ' + context.params.query.patientDetails.pharmacy.name,
            data: JSON.stringify(context.params.query.patientDetails),
            updateFields: context.params.query.updateFields,
            previousValues: context.params.query.previousValues,
            currentValues: context.params.query.currentValues,
            service: context.path,
            method: 'Create',
            outcome: context.error ? 'Failure' : 'Success'
          }).then(data => {
            // context.params.query.viewPage = '';
          }).catch(err => console.log(err));
        } else if (context.method === 'patch') {
          console.log('patientPatch', context.result.params);
          context.app.service('audit-logs').create({
            userId: context.params.user._id,
            pharmacyId: context.params.user.details.pharmacy_id[0],
            username: (context.params.user.username === '') ? 'External User' : context.params.user.username,
            rxId: 'NA',
            patient: (context.result.hippaParams.query.patientPatch === 'HippaSignPatch') ? '' : context.result.elasticData.name.firstName + ' ' + context.result.elasticData.name.lastName,
            prescriber: 'NA',
            drug: 'NA',
            dea: 'NA',
            messageId: 'NA',
            description: (context.result.hippaParams.query.patientPatch === 'HippaSignPatch') ? context.params.user.username + ' Updated Patient Hippa Signature' : (context.params.user.username + ' Updated Patient: ' + context.result.elasticData.name.firstName + ' ' + context.result.elasticData.name.lastName + ' On ' + context.result.params.patientDetails.pharmacy.name),
            data: (context.result.hippaParams.query.patientPatch === 'HippaSignPatch') ? '' : JSON.stringify(context.result.elasticData),
            updateFields: (context.result.hippaParams.query.patientPatch === 'HippaSignPatch') ? context.result.hippaParams.query.updateFields : context.result.params.updateFields,
            previousValues: (context.result.hippaParams.query.patientPatch === 'HippaSignPatch') ? context.result.hippaParams.query.previousValues : context.result.params.previousValues,
            currentValues: (context.result.hippaParams.query.patientPatch === 'HippaSignPatch') ? context.result.hippaParams.query.currentValues : context.result.params.currentValues,
            service: context.path,
            method: 'Update',
            outcome: context.error ? 'Failure' : 'Success'
          }).then(data => {
            // context.params.query.viewPage = '';
          }).catch(err => console.log(err));
        }
      } else if (context.path === 'prescriber') {
        console.log('prescriberPath', context.data);
        if (context.method === 'create') {
          context.app.service('audit-logs').create({
            userId: context.params.user._id,
            pharmacyId: context.params.user.details.pharmacy_id[0],
            username: (context.params.user.username === '') ? 'External User' : context.params.user.username,
            rxId: 'NA',
            patient: 'NA',
            prescriber: context.params.query.prescriberDetails.name.firstName + ' ' + context.params.query.prescriberDetails.name.lastName,
            drug: 'NA',
            dea: 'NA',
            messageId: 'NA',
            description: context.params.user.username + ' Created Prescriber: ' + context.params.query.prescriberDetails.name.firstName + ' ' + context.params.query.prescriberDetails.name.lastName,
            data: JSON.stringify(context.params.query.prescriberDetails),
            updateFields: context.params.query.updateFields,
            previousValues: context.params.query.previousValues,
            currentValues: context.params.query.currentValues,
            service: context.path,
            method: 'Create',
            outcome: context.error ? 'Failure' : 'Success'
          }).then(data => {
            // context.params.query.viewPage = '';
          }).catch(err => console.log(err));
        } else if (context.method === 'patch') {
          context.app.service('audit-logs').create({
            userId: context.params.user._id,
            pharmacyId: context.params.user.details.pharmacy_id[0],
            username: (context.params.user.username === '') ? 'External User' : context.params.user.username,
            rxId: 'NA',
            patient: 'NA',
            prescriber: context.result.elasticData.name.firstName + ' ' + context.result.elasticData.name.lastName,
            drug: 'NA',
            dea: 'NA',
            messageId: 'NA',
            description: context.params.user.username + ' Updated Prescriber: ' + context.result.elasticData.name.firstName + ' ' + context.result.elasticData.name.lastName,
            data: JSON.stringify(context.params.query.prescriberDetails),
            updateFields: context.result.params.updateFields,
            previousValues: context.result.params.previousValues,
            currentValues: context.result.params.currentValues,
            service: context.path,
            method: 'Update',
            outcome: context.error ? 'Failure' : 'Success'
          }).then(data => {
            // context.params.query.viewPage = '';
          }).catch(err => console.log(err));
        }


        // context.app.service('audit-logs').create({
        //   userId: context.params.user._id,
        //   username: (context.params.user.username === '') ? 'External User' : context.params.user.username,
        //   rxId: Number,
        //   messageId: String,
        //   data: JSON.stringify(context.data),
        //   service: context.path,
        //   description: context.params.user.username + context.method === 'patch' ? 'Updated' + context.result.name.firstName + 'prescriber' : context.method + context.result.name.firstName + 'prescriber',
        //   method: context.method === 'patch' ? 'Updated' : context.method === 'create'?'created':context.method,
        //   outcome: context.error ? 'failed' : 'Success',
        // }).then(data => {
        // }).catch(err => console.log(err));
      } else if (context.path === 'surescript') {
        context.app.service('audit-logs').create({
          userId: context.params.user._id,
          username: (context.params.user.username === undefined) ? 'External User' : context.params.user.username,
          rxId: null,
          messageId: (context.data.messageId) ? (context.data.messageId) : null,
          data: JSON.stringify(context.data),
          service: context.path,
          method: context.method === 'patch' ? 'Updated' : context.method === 'create' ? 'created' : context.method,
          outcome: context.error ? context.error.stack : 'Success',
        }).then(data => {
          // console.log(data);
        }).catch(err => console.log(err));
      }
    } else if (context.path !== 'audit-logs' && context.path !== 'authentication' && context.params.user && context.method === 'get' && context.type === 'after') {
      if (context.path === 'rx' && context.params.query.viewPage === 'verification') {
        let rxlogsView = {
          rxId: context.result.rxId,
          isPriorty: context.result.isPriorty,
          rxType: context.result.rxTye,
          patient_id: context.result.patient_id,
          productDetails: {
            productName: context.result.productDetails.productName,
            name: context.result.productDetails.name,
            DEAClass: context.result.productDetails.DEAClass
          },
          digitalSignature: [context.result.digitalSignature],
          prescriber_id: context.result.prescriber_id,
          prescriberLocationName: '',
          product_id: context.result.product_id,
          pharmacy_id: context.result.pharmacy_id,
          refills: {
            fills: [{
              user: {
                username: context.params.user.username,
                lastAction: 'Viewed',
                outcome: 'Success',
              }
            }, {
              timestamps: true
            }],
          },
        };
        context.app.service('rx-logs').create(rxlogsView).then(result => {
        }).catch(err => console.log(err));
        context.app.service('audit-logs').create({
          userId: context.params.user._id,
          pharmacyId: context.params.user.details.pharmacy_id[0],
          username: (context.params.user.username === '') ? 'External User' : context.params.user.username,
          rxId: context.result.rxId,
          patient: context.result.patient.name.firstName + ' ' + context.result.patient.name.lastName,
          prescriber: context.result.prescriber.name.firstName + ' ' + context.result.prescriber.name.lastName,
          drug: context.result.productDetails.name,
          dea: context.result.productDetails.DEAClass,
          messageId: 'NA',
          description: context.params.user.username + ' Viewed rxId: ' + context.result.rxId + ' on ' + context.params.query.viewPage + ' page',
          data: JSON.stringify(context.data),
          updateFields: 'NA',
          previousValues: 'NA',
          currentValues: 'NA',
          service: context.path,
          method: (context.method === 'get') ? 'View' : context.method,
          outcome: context.error ? 'Failure' : 'Success'
        }).then(data => {
          context.params.query.viewPage = '';
        }).catch(err => console.log(err));
      }
    } else if (context.path === 'authentication') {
      if (context.error) {
        context.app.service('audit-logs').Model.create({
          username: context.data.username,
          data: JSON.stringify(context.data),
          service: 'authentication',
          method: 'login',
          outcome: 'Failure'
        });
      }
    }
    return context;
  };
};
