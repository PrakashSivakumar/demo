// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
function ndcVerify(context, ndc) {
  return new Promise((resolve, reject) => {
    context.app.service('package').find({
      query: {
        'NDC11': ndc,
        'type':'ndc'
      }
    }).then(result => {
      if (result['length'] !== 0) {
        resolve(result[0].gsdd5Product[0]._id);
      } else {
        resolve('NotanEPCS');
      }
    }).catch(err => reject(err));
  });
}

module.exports = function (options = {}) {
  return async context => {

    if (Object.keys(context.data.message.body[0])[0] === 'newrx') {
      if(context.data.message.body[0].newrx[0].hasOwnProperty('medicationprescribed')) {
        if(context.data.message.body[0].newrx[0].medicationprescribed[0].hasOwnProperty('drugcoded')) {
          if(context.data.message.body[0].newrx[0].medicationprescribed[0].drugcoded[0].hasOwnProperty('productcodequalifier')) {
            if(context.data.message.body[0].newrx[0].medicationprescribed[0].drugcoded[0].productcodequalifier[0] === 'ND') {
                let ndc =((context.data.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('drugcoded')) ? (context.data.message.body[0].newrx[0].medicationprescribed[0].drugcoded[0].productcode[0]).replace(/^0+/, '') : '';
                let checkwithNDC = await ndcVerify(context,ndc);
                console.log('check with NDC', checkwithNDC);
                if(checkwithNDC === 'NotanEPCS') {
                  let notEPCS = {
                    EPCS: 'NotanEPCS',
                    Phone: (context.data.message.body[0].newrx[0].prescriber[0].communicationnumbers[0].communication[0].qualifier[0] === 'TE') ?
                      (context.data.message.body[0].newrx[0].prescriber[0].communicationnumbers[0].communication[0].number[0]) : ((context.data.message.body[0].newrx[0].prescriber[0].communicationnumbers[0].communication[0].qualifier[0] === 'EM') ?
                        (context.data.message.body[0].newrx[0].prescriber[0].communicationnumbers[0].communication[0].number[0]) : '')
                  };
                  let invalidSign = {
                    patientFName: context.data.message.body[0].newrx[0].patient[0].name[0].hasOwnProperty('firstname') ? context.data.message.body[0].newrx[0].patient[0].name[0].firstname[0] : '',
                    patientLName: context.data.message.body[0].newrx[0].patient[0].name[0].lastname[0],
                    prescriberFName: context.data.message.body[0].newrx[0].prescriber[0].name[0].hasOwnProperty('firstname') ? context.data.message.body[0].newrx[0].prescriber[0].name[0].firstname[0] : '',
                    prescriberLName: context.data.message.body[0].newrx[0].prescriber[0].name[0].lastname[0],
                    drugName: context.data.message.body[0].newrx[0].medicationprescribed[0].drugdescription[0],
                    signatureVerified: 'No',
                    signature: ((context.data.message.header[0]).hasOwnProperty('digitalsignature'))?
                      (((context.data.message.header[0].digitalsignature[0]).hasOwnProperty('signaturevalue'))?
                        context.data.message.header[0].digitalsignature[0].signaturevalue[0]:''):'',
                  };
                  context.app.service('invalidsign').create(invalidSign);
                  context.data = notEPCS;
                } else {
                  if(context.data.message.body[0].newrx[0].medicationprescribed[0].hasOwnProperty('drugcoveragestatuscode') && context.data.message.body[0].newrx[0].prescriber[0].identification[0].hasOwnProperty('deanumber')) {

                      console.log('this is a signed prescription');
                      let notificationObject = {
                        pharmacyNPI: ((context.data.message.body[0].newrx[0].pharmacy[0].identification[0]).hasOwnProperty('npi')) ?
                          context.data.message.body[0].newrx[0].pharmacy[0].identification[0].npi[0] : '',
                        pharmacyNCPDPID: ((context.data.message.body[0].newrx[0].pharmacy[0].identification[0]).hasOwnProperty('ncpdpid')) ?
                          context.data.message.body[0].newrx[0].pharmacy[0].identification[0].ncpdpid[0] : '',
                        pon: ((context.data.message.header[0]).hasOwnProperty('prescriberordernumber')) ?
                          context.data.message.header[0].prescriberordernumber[0] : '',
                        patientName: context.data.message.body[0].newrx[0].patient[0].name[0].lastname[0],
                        prescriberName: context.data.message.body[0].newrx[0].prescriber[0].name[0].lastname[0],
                        notificationFrom: 'surescripts',
                        prescriber_npi: ((context.data.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('identification')) ?
                          (((context.data.message.body[0].newrx[0].prescriber[0].identification[0]).hasOwnProperty('npi')) ?
                            context.data.message.body[0].newrx[0].prescriber[0].identification[0].npi[0] : '') : '',
                        receipientId: context.data.message.header[0].to[0]._,
                        senderId: context.data.message.header[0].from[0]._,
                        messageId: context.data.message.header[0].messageid[0],
                        sentDateTime: context.data.message.header[0].senttime[0],
                        rxType: 'new',
                        deleted: 'false',
                        message: JSON.stringify(context.data),
                        status: 'unread'
                      };
                      let invalidSign = {
                        patientFName: context.data.message.body[0].newrx[0].patient[0].name[0].hasOwnProperty('firstname') ? context.data.message.body[0].newrx[0].patient[0].name[0].firstname[0] : '',
                        patientLName: context.data.message.body[0].newrx[0].patient[0].name[0].lastname[0],
                        prescriberFName: context.data.message.body[0].newrx[0].prescriber[0].name[0].hasOwnProperty('firstname') ? context.data.message.body[0].newrx[0].prescriber[0].name[0].firstname[0] : '',
                        prescriberLName: context.data.message.body[0].newrx[0].prescriber[0].name[0].lastname[0],
                        drugName: context.data.message.body[0].newrx[0].medicationprescribed[0].drugdescription[0],
                        signatureVerified: 'Yes',
                        signature: ((context.data.message.header[0]).hasOwnProperty('digitalsignature'))?
                          (((context.data.message.header[0].digitalsignature[0]).hasOwnProperty('signaturevalue'))?
                            context.data.message.header[0].digitalsignature[0].signaturevalue[0]:''):'',
                      };
                      context.app.service('invalidsign').create(invalidSign);
                      context.data = notificationObject;

                  }
                  else {
                    let notCS = {
                      EPCS: 'NotanEPCS',
                      Phone: (context.data.message.body[0].newrx[0].prescriber[0].communicationnumbers[0].communication[0].qualifier[0] === 'TE') ?
                        (context.data.message.body[0].newrx[0].prescriber[0].communicationnumbers[0].communication[0].number[0]) : ((context.data.message.body[0].newrx[0].prescriber[0].communicationnumbers[0].communication[0].qualifier[0] === 'EM') ?
                          (context.data.message.body[0].newrx[0].prescriber[0].communicationnumbers[0].communication[0].number[0]) : '')
                    };
                    let invalidSign = {
                      patientFName: context.data.message.body[0].newrx[0].patient[0].name[0].hasOwnProperty('firstname') ? context.data.message.body[0].newrx[0].patient[0].name[0].firstname[0] : '',
                      patientLName: context.data.message.body[0].newrx[0].patient[0].name[0].lastname[0],
                      prescriberFName: context.data.message.body[0].newrx[0].prescriber[0].name[0].hasOwnProperty('firstname') ? context.data.message.body[0].newrx[0].prescriber[0].name[0].firstname[0] : '',
                      prescriberLName: context.data.message.body[0].newrx[0].prescriber[0].name[0].lastname[0],
                      drugName: context.data.message.body[0].newrx[0].medicationprescribed[0].drugdescription[0],
                      signatureVerified: 'No',
                      signature: ((context.data.message.header[0]).hasOwnProperty('digitalsignature'))?
                        (((context.data.message.header[0].digitalsignature[0]).hasOwnProperty('signaturevalue'))?
                          context.data.message.header[0].digitalsignature[0].signaturevalue[0]:''):'',
                    };
                    context.app.service('invalidsign').create(invalidSign);
                    context.data = notCS;
                  }
                }
              }
          }
        }
      }
      else {
        console.log('this is a normal prescription');
        let notificationObject = {
          pharmacyNPI: ((context.data.message.body[0].newrx[0].pharmacy[0].identification[0]).hasOwnProperty('npi')) ?
            context.data.message.body[0].newrx[0].pharmacy[0].identification[0].npi[0] : '',
          pharmacyNCPDPID: ((context.data.message.body[0].newrx[0].pharmacy[0].identification[0]).hasOwnProperty('ncpdpid')) ?
            context.data.message.body[0].newrx[0].pharmacy[0].identification[0].ncpdpid[0] : '',
          pon: ((context.data.message.header[0]).hasOwnProperty('prescriberordernumber')) ?
            context.data.message.header[0].prescriberordernumber[0] : '',
          patientName: context.data.message.body[0].newrx[0].patient[0].name[0].lastname[0],
          prescriberName: context.data.message.body[0].newrx[0].prescriber[0].name[0].lastname[0],
          notificationFrom: 'surescripts',
          prescriber_npi: ((context.data.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('identification')) ?
            (((context.data.message.body[0].newrx[0].prescriber[0].identification[0]).hasOwnProperty('npi')) ?
              context.data.message.body[0].newrx[0].prescriber[0].identification[0].npi[0] : '') : '',
          receipientId: context.data.message.header[0].to[0]._,
          senderId: context.data.message.header[0].from[0]._,
          messageId: context.data.message.header[0].messageid[0],
          sentDateTime: context.data.message.header[0].senttime[0],
          rxType: 'new',
          deleted: 'false',
          message: JSON.stringify(context.data),
          status: 'unread'
        };
        context.data = notificationObject;
      }
    }
    else if (Object.keys(context.data.message.body[0])[0] === 'cancelrx') {
      console.log('this is cancel rx:', context.data.message.body[0]);
      let notificationObject = {
        pharmacyNPI: ((context.data.message.body[0].cancelrx[0].pharmacy[0].identification[0]).hasOwnProperty('npi')) ?
          context.data.message.body[0].cancelrx[0].pharmacy[0].identification[0].npi[0] : '',
        pharmacyNCPDPID: ((context.data.message.body[0].cancelrx[0].pharmacy[0].identification[0]).hasOwnProperty('ncpdpid'))?
          context.data.message.body[0].cancelrx[0].pharmacy[0].identification[0].ncpdpid[0] : '',
        pon: ((context.data.message.header[0]).hasOwnProperty('prescriberordernumber')) ?
            context.data.message.header[0].prescriberordernumber[0]: '',
        patientName: context.data.message.body[0].cancelrx[0].patient[0].name[0].lastname[0],
        prescriberName: context.data.message.body[0].cancelrx[0].prescriber[0].name[0].lastname[0],
        notificationFrom: 'surescripts',
        prescriber_npi: ((context.data.message.body[0].cancelrx[0].prescriber[0]).hasOwnProperty('identification'))?
          (((context.data.message.body[0].cancelrx[0].prescriber[0].identification[0]).hasOwnProperty('npi'))?
            context.data.message.body[0].cancelrx[0].prescriber[0].identification[0].npi[0]:''):'',
        receipientId: context.data.message.header['0'].to['0']._,
        senderId: context.data.message.header['0'].from['0']._,
        messageId: context.data.message.header['0'].messageid,
        sentDateTime: context.data.message.header['0'].senttime,
        rxType: 'Cancel',
        deleted: 'false',
        message: JSON.stringify(context.data),
        status: 'unread'
      };
      context.data = notificationObject;
    }
    else if (Object.keys(context.data.message.body[0])[0] === 'refillresponse') {
      console.log('this is refill response rx:', context.data.message.body[0].refillresponse[0].prescriber[0].identification[0].npi[0]);
      let notificationObject = {
        pharmacyNPI: ((context.data.message.body[0].refillresponse[0].pharmacy[0].identification[0]).hasOwnProperty('npi')) ?
          context.data.message.body[0].refillresponse[0].pharmacy[0].identification[0].npi[0] : '',
        pharmacyNCPDPID: ((context.data.message.body[0].refillresponse[0].pharmacy[0].identification[0]).hasOwnProperty('ncpdpid'))?
          context.data.message.body[0].refillresponse[0].pharmacy[0].identification[0].ncpdpid[0] : '',
        pon: context.data.message.header[0].prescriberordernumber[0],
        patientName: context.data.message.body[0].refillresponse[0].patient[0].name[0].lastname[0],
        prescriberName: context.data.message.body[0].refillresponse[0].prescriber[0].name[0].lastname[0],
        notificationFrom: 'surescripts',
        prescriber_npi: ((context.data.message.body[0].refillresponse[0].prescriber[0]).hasOwnProperty('identification'))?
          (((context.data.message.body[0].refillresponse[0].prescriber[0].identification[0]).hasOwnProperty('npi'))?
            context.data.message.body[0].refillresponse[0].prescriber[0].identification[0].npi[0]:''):'',
        receipientId: context.data.message.header[0].to[0]._,
        senderId: context.data.message.header[0].from[0]._,
        messageId: context.data.message.header[0].messageid[0],
        sentDateTime: context.data.message.header[0].senttime[0],
        rxType: 'Refill',
        rxNumber: context.data.message.header[0].rxreferencenumber[0],
        deleted: 'false',
        message: JSON.stringify(context.data),
        status: 'unread'
      };
      if (Object.keys(context.data.message.body[0].refillresponse[0].response[0])[0] === 'approved') {
        context.data = notificationObject;
      }
      else if(Object.keys(context.data.message.body[0].refillresponse[0].response[0])[0] === 'denied') {
        context.data = notificationObject;
      }
    }
    else {
      let sentTime = new Date();
      let errorXml = `<?xml version="1.0" encoding="UTF-8"?>
                      <Message xmlns="http://www.ncpdp.org/schema/SCRIPT" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="010" release="006" xsi:schemaLocation="http://www.ncpdp.org/schema/SCRIPT SS_SCRIPT_ XML_10_6MU.xsd">
                      <Header>
                      <To Qualifier="` + context.data.message.header['0'].from['0'].$.Qualifier + '">' + context.data.message.header['0'].from['0']._ + `</To>
                      <From Qualifier="` + context.data.message.header['0'].to['0'].$.Qualifier + '">' + context.data.message.header['0'].to['0']._ + `</From>
                      <MessageID>` + context.data.message.header['0'].messageid['0'] + `</MessageID>
                      <RelatesToMessageID></RelatesToMessageID>
                      <SentTime>` + sentTime.toISOString() + `</SentTime>
                      <Security>
                      <Sender>
                      <TertiaryIdentification>` + context.data.message.header['0'].security['0'].sender['0'].tertiaryidentification['0'] + `</TertiaryIdentification>
                      </Sender>
                      <Receiver>
                      <TertiaryIdentification>` + context.data.message.header['0'].prescriberordernumber['0'] + `</TertiaryIdentification>
                      </Receiver>
                      </Security>
                      </Header>
                      <Body>
                      <Error>
                      <Code>010</Code>
                      <DescriptionCode></DescriptionCode>
                      </Error>
                      </Body>
                      </Message>`;
      console.log('this is error xml file from surescripts -- need to send back to surescripts with err code as', errorXml);
      context.result = errorXml;
    }
    return context;
  };
};
