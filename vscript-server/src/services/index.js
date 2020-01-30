const patient = require('./patient/patient.service.js');
const users = require('./users/users.service.js');
const prescriber = require('./prescriber/prescriber.service.js');

const rx = require('./rx/rx.service.js');

const product = require('./product/product.service.js');

const checkout = require('./checkout/checkout.service.js');

const pharmacy = require('./pharmacy/pharmacy.service.js');

const package = require('./package/package.service.js');

const claimLog = require('./claim-log/claim-log.service.js');

const f5RejectCode = require('./f-5-reject-code/f-5-reject-code.service.js');

const fax = require('./fax/fax.service.js');

const pmpLog = require('./pmp-log/pmp-log.service.js');

const notification = require('./notification/notification.service.js');

const inventory = require('./inventory/inventory.service.js');

const patientCounselling = require('./patient-counselling/patient-counselling.service.js');

const conversation = require('./conversation/conversation.service.js');

const claim = require('./claim/claim.service.js');

const twilio = require('./twilio/twilio.service.js');

const message = require('./message/message.service.js');


const report = require('./report/report.service.js');


const search = require('./search/search.service.js');


const migration = require('./migration/migration.service.js');


const gcs = require('./gcs/gcs.service.js');


const gsdd5Upload = require('./gsdd-5-upload/gsdd-5-upload.service.js');


const gsdd5Product = require('./gsdd5/gsdd-5-product/gsdd-5-product.service.js');


const gsdd5Package = require('./gsdd5/gsdd-5-package/gsdd-5-package.service.js');


const gsdd5ProductAdverseReaction = require('./gsdd5/gsdd-5-product-adverse-reaction/gsdd-5-product-adverse-reaction.service.js');


const gsdd5WarningLabelGroup = require('./gsdd5/gsdd-5-warning-label-group/gsdd-5-warning-label-group.service.js');


const gsdd5WarningLabelShort = require('./gsdd5/gsdd-5-warning-label-short/gsdd-5-warning-label-short.service.js');


const gsdd5ProductWarningLabel = require('./gsdd5/gsdd-5-product-warning-label/gsdd-5-product-warning-label.service.js');


const gsdd5PatientEducationInt1 = require('./gsdd5/gsdd-5-patient-education-int-1/gsdd-5-patient-education-int-1.service.js');


const gsdd5ProductPatientSheets = require('./gsdd5/gsdd-5-product-patient-sheets/gsdd-5-product-patient-sheets.service.js');


const gsdd5NondrugItemImageList = require('./gsdd5/gsdd-5-nondrug-item-image-list/gsdd-5-nondrug-item-image-list.service.js');


const gsdd5DrugItemImageList = require('./gsdd5/gsdd-5-drug-item-image-list/gsdd-5-drug-item-image-list.service.js');


const gsdd5GsTermIcd10 = require('./gsdd5/gsdd-5-gs-term-icd-10/gsdd-5-gs-term-icd-10.service.js');


const gsdd5GsTerms = require('./gsdd5/gsdd-5-gs-terms/gsdd-5-gs-terms.service.js');


const gsdd5Sigcode = require('./gsdd5/gsdd-5-sigcode/gsdd-5-sigcode.service.js');


const gsdd5MarketedProductRxNormPrescribableName = require('./gsdd5/gsdd-5-marketed-product-rx-norm-prescribable-name/gsdd-5-marketed-product-rx-norm-prescribable-name.service.js');


const gsdd5DeaClassification = require('./gsdd5/gsdd-5-dea-classification/gsdd-5-dea-classification.service.js');


const gssd5Federal = require('./gsdd5/gssd-5-federal/gssd-5-federal.service.js');


const gsdd5ProductStrengthRouteForm = require('./gsdd5/gsdd-5-product-strength-route-form/gsdd-5-product-strength-route-form.service.js');


const gsdd5Price = require('./gsdd5/gsdd-5-price/gsdd-5-price.service.js');


const gsdd5MarketedProduct = require('./gsdd5/gsdd-5-marketed-product/gsdd-5-marketed-product.service.js');





const receiveRx = require('./receive-rx/receive-rx.service.js');


const gsdd5PackageImageList = require('./gsdd5/gsdd-5-package-image-list/gsdd-5-package-image-list.service.js');


const counters = require('./counters/counters.service.js');


const square = require('./square/square.service.js');


const refillresponse = require('./refillresponse/refillresponse.service.js');


const xmlRefillRequest = require('./xml-refill-request/xml-refill-request.service.js');


const rxLogs = require('./rx-logs/rx-logs.service.js');


const auditLogs = require('./audit-logs/audit-logs.service.js');


const accesscontrol = require('./accesscontrol/accesscontrol.service.js');


const esearchsync = require('./esearchsync/esearchsync.service.js');


const surescript = require('./surescript/surescript.service.js');


const systemaccess = require('./systemaccess/systemaccess.service.js');


const ownerReport = require('./owner-console/owner-report/owner-report.service.js');


const hub = require('./hub/hub.service.js');


const ownerTransaction = require('./owner-console/owner-transaction/owner-transaction.service.js');


const ownerdrugMargin = require('./owner-console/ownerdrug-margin/ownerdrug-margin.service.js');


const rule = require('./rule/rule.service.js');


const druglistEdi = require('./druglist-edi/druglist-edi.service.js');


const productOrder = require('./product-order/product-order.service.js');


const patientFlutter = require('./patient-flutter/patient-flutter.service.js');


const gsdd5Allergy = require('./gsdd5/gsdd-5-allergy/gsdd-5-allergy.service.js');


const orderhistory = require('./orderhistory/orderhistory.service.js');


const webhook = require('./webhook/webhook.service.js');


const invalidsign = require('./invalidsign/invalidsign.service.js');


const twiliofax = require('./twiliofax/twiliofax.service.js');


const maintainance = require('./maintainance/maintainance.service.js');


const loginlogs = require('./loginlogs/loginlogs.service.js');


const payroll = require('./payroll/payroll.service.js');


const appUpdate = require('./app-update/app-update.service.js');


const audit = require('./audit/audit.service.js');


const gcpauditbucket = require('./gcpauditbucket/gcpauditbucket.service.js');


const timeSheets = require('./time-sheets/time-sheets.service.js');


const patienthistory = require('./patienthistory/patienthistory.service.js');


const cctvlogs = require('./cctvlogs/cctvlogs.service.js');


const callEnd = require('./call-end/call-end.service.js');





const vectorsoftmail = require('./vectorsoftmail/vectorsoftmail.service.js');





const bikeHelmetRecognition = require('./bike-helmet-recognition/bike-helmet-recognition.service.js');





const carSeatbeltRecognition = require('./car-seatbelt-recognition/car-seatbelt-recognition.service.js');





const vehicleDetails = require('./vehicle-details/vehicle-details.service.js');





const tasklist = require('./tasklist/tasklist.service.js');





const signaljumpcar = require('./signaljumpcar/signaljumpcar.service.js');





const videocollab = require('./videocollab/videocollab.service.js');





const videothisweek = require('./videothisweek/videothisweek.service.js');





const videolastweek = require('./videolastweek/videolastweek.service.js');





const addEmployee = require('./add-employee/add-employee.service.js');





const workforceEmployee = require('./workforce/employee/employee.service.js');





const workforceContact = require('./workforce/contact/contact.service.js');





const workforceEducation = require('./workforce/education/education.service.js');





const workforceWorkauthorization = require('./workforce/workauthorization/workauthorization.service.js');





const workforceDependents = require('./workforce/dependents/dependents.service.js');





const workforcePlacements = require('./workforce/placements/placements.service.js');





const workforceSkills = require('./workforce/skills/skills.service.js');





const wfusers = require('./wfusers/wfusers.service.js');





//const auditemail = require('./auditemail/auditemail.service.js');


// eslint-disable-next-line no-unused-vars
module.exports = function (app) {
  app.configure(patient);
  app.configure(users);
  app.configure(prescriber);
  app.configure(rx);
  app.configure(product);
  app.configure(checkout);
  app.configure(pharmacy);
  app.configure(package);

  app.configure(claimLog);
  app.configure(f5RejectCode);
  app.configure(fax);
  app.configure(pmpLog);

  app.configure(notification);
  app.configure(inventory);
  app.configure(patientCounselling);
  app.configure(conversation);
  app.configure(claim);
  app.configure(twilio);
  app.configure(message);
  app.configure(report);
  app.configure(search);
  app.configure(migration);
  app.configure(gcs);

  app.configure(gsdd5Upload);
  app.configure(gsdd5Product);
  app.configure(gsdd5Package);
  app.configure(gsdd5ProductAdverseReaction);
  app.configure(gsdd5WarningLabelGroup);
  app.configure(gsdd5WarningLabelShort);
  app.configure(gsdd5ProductWarningLabel);
  app.configure(gsdd5PatientEducationInt1);
  app.configure(gsdd5ProductPatientSheets);
  app.configure(gsdd5NondrugItemImageList);
  app.configure(gsdd5DrugItemImageList);
  app.configure(gsdd5GsTermIcd10);
  app.configure(gsdd5GsTerms);
  app.configure(gsdd5Sigcode);
  app.configure(gsdd5MarketedProductRxNormPrescribableName);
  app.configure(gsdd5DeaClassification);
  app.configure(gssd5Federal);
  app.configure(gsdd5ProductStrengthRouteForm);
  app.configure(gsdd5Price);
  app.configure(gsdd5MarketedProduct);
  app.configure(receiveRx);
  app.configure(gsdd5PackageImageList);
  app.configure(counters);
  app.configure(patientFlutter);
  app.configure(square);
  app.configure(refillresponse);
  app.configure(xmlRefillRequest);
  app.configure(rxLogs);
  app.configure(auditLogs);
  app.configure(accesscontrol);
  app.configure(esearchsync);
  app.configure(surescript);
  app.configure(systemaccess);
  app.configure(ownerReport);
  app.configure(hub);
  app.configure(ownerTransaction);
  app.configure(ownerdrugMargin);
  app.configure(rule);
  app.configure(druglistEdi);
  app.configure(productOrder);
  app.configure(gsdd5Allergy);
  app.configure(orderhistory);
  app.configure(webhook);
  app.configure(invalidsign);
  app.configure(twiliofax);
  app.configure(maintainance);
  app.configure(loginlogs);
  app.configure(payroll);
  app.configure(appUpdate);
  //app.configure(auditemail);
  app.configure(audit);
  app.configure(gcpauditbucket);
  app.configure(timeSheets);
  app.configure(patienthistory);
  app.configure(cctvlogs);
  app.configure(callEnd);
  app.configure(vectorsoftmail);
  app.configure(bikeHelmetRecognition);
  app.configure(carSeatbeltRecognition);
  app.configure(vehicleDetails);
  app.configure(tasklist);
  app.configure(signaljumpcar);
  app.configure(videocollab);
  app.configure(videothisweek);
  app.configure(videolastweek);
  app.configure(addEmployee);
  app.configure(workforceEmployee);
  app.configure(workforceContact);
  app.configure(workforceEducation);
  app.configure(workforceWorkauthorization);
  app.configure(workforceDependents);
  app.configure(workforcePlacements);
  app.configure(workforceSkills);
  app.configure(wfusers);
};
