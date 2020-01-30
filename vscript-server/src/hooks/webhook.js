// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
const {Notification} = require('./notification/notification.model');
module.exports = function (options = {}) {
  return async context => {
    console.log('webhook', context.data);

    let lastFill;
    let patientName;
    let patientResult;
    let notification;

    function refillRequest() {
      return new Promise((resolve, reject) => {
        if (context.data.queryResult.intent.displayName === 'Refill request' && context.data.queryResult.parameters.id !== '') {
          let rxId = parseInt(context.data.queryResult.parameters.id);
          context.app.service('rx').Model.findOne({
            'rxId': rxId
          }).then(result => {
            console.log(result);

            if (result === null) {
              resolve('No Records found, if you need any help just say 4 for talk to Pharmacy or if you want terminate the call just say 5 for end call');
            } else if (((result.refills.total) - (result.refills.fills.length - 1)) === 0) {
              resolve('Your Refills Over, please meet your prescriber and if you want terminate the call just say 5 for end call');
            } else if (((result.refills.total) - (result.refills.fills.length - 1)) > 0) {
              lastFill = result.refills.fills.slice(-1)[0];
              let fill = {
                daw: null,
                unitOfMeasure: '',
                rxOriginCode: '',
                iou: 0,
                billTo: 'CASH',
                sig: {
                  code: lastFill.sig.code,
                  description: lastFill.sig.description
                },
                number: result.refills.fills.length,
                quantityDispensed: lastFill.quantityDispensed,
                daysSupply: lastFill.daysSupply,
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
                status: 'Billed for Cash',
                deliveryMethod: '',
                orderedQuantity: lastFill.orderedQuantity,
                verificationStatus: '',
                fillDate: Date.now(),
              };
              result.refills.fills.push(fill);
              console.log(result.refills.fills.length);
              context.app.service('rx').patch(result._id, result, context.params)
                .then(result => {
                  notification = new Notification({
                    triggeredBy: context.params.user._id,
                    notify: [{status: 'notify'}],
                    notification: 'Refill request sucessfully Added to ' + result.rxId + ' through IVR',
                    notificationType: 'refill request',
                    pharmacy_id: result.pharmacy_id,
                    typeStatus: '',
                    data: result._id,
                    role: ['admin', 'technician']
                  });
                  context.app.service('notification').create(notification);
                  resolve('Your refill request sucessful, now ready to filling once ready we will inform you the pickup status, if you want terminate the call just say 5 for end call');
                }).catch(err => reject(err));
            }
          }).catch(err => reject(err));
        } else if (context.data.queryResult.intent.displayName === 'Default Welcome Intent') {
          context.app.service('patient').find({
            query: {
              'contact.phone': context.data.originalDetectIntentRequest.payload.telephony.caller_id
            }
          }).then(result => {
            if (result.total !== 0) {
              patientName = result.data[0].name.firstName + ' ' + result.data[0].name.lastName;
              patientResult = result.total;
              console.log(patientName);
              resolve(patientName);
            } else {
              patientResult = result.total;
              resolve('No Records');
            }
          }).catch(err => reject(err));
        } else if (context.data.queryResult.intent.displayName === 'Talk to a pharmacist.') {
          context.app.service('patient').find({
            query: {
              'contact.phone': context.data.originalDetectIntentRequest.payload.telephony.caller_id
            }
          }).then(result => {
            if (result.total !== 0) {
              patientName = result.data[0].name.firstName + ' ' + result.data[0].name.lastName;
              notification = new Notification({
                triggeredBy: context.params.user._id,
                notify: [{status: 'notify'}],
                notification: patientName + ' ' + context.data.originalDetectIntentRequest.payload.telephony.caller_id + ' ' + 'Patient calling',
                notificationType: 'talkpharmacy',
                typeStatus: patientName + ' ' + context.data.originalDetectIntentRequest.payload.telephony.caller_id,
                data: result.data[0]._id,
                role: ['admin', 'technician', 'pharmacist', 'owner']
              });
              context.app.service('notification').create(notification);
            }
          }).catch(err => reject(err));
        }
      });
    }


    let refillMessage = await refillRequest();
    let sendmessage = context.data.queryResult.intent.displayName === 'Refill request' && context.data.queryResult.parameters.id !== '' ? refillMessage :
      (context.data.queryResult.intent.displayName === 'Default Welcome Intent' && patientResult !== 0) ? 'Hi' + ' ' + refillMessage + ' ' + 'Welcome to V Script.If you need anything ' +
        'to know just say like  2 for Refill request,   3 for Prescription Status,   4 for Talk to pharmacy ,   5 for end call , repeat the options again just say 1 for repeat ' : (context.data.queryResult.intent.displayName === 'Default Welcome Intent' && patientResult === 0) ?
        'No records found based on your phone number, if want talk to pahrmacy just say 4 for talk to pharmacy or if you want to terminate the call just say 5 for end call' : 'say that again';


    context.result = {
      'fulfillmentText': sendmessage,
      'fulfillmentMessages': [
        {
          'card': null,
          'text': {
            'text': [
              sendmessage
            ]
          }
        }
      ],
      'source': null,
      'payload': null,
      'outputContexts': null,
      'followupEventInput': null
    };
    return context;
  };
};

