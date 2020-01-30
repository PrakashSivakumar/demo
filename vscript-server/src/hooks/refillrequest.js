// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    let path = require('path');
    // let crtPath = path.join(__dirname, '..', 'ssl', 'vscriptco', 'graph_vscript_co.csr');
    let crtPath = path.join(__dirname, '..', 'ssl', 'vscriptco_new', 'graph.vscript.co.p7b');
    let keyPath = path.join(__dirname, '..', 'ssl', 'vscriptco_new', 'private.key');
    let xml = require('xml');
    let btoa = require('btoa');
    let rxRefNum = await getRxRefNumber(context.data.rx_Id);
    let obj = JSON.parse(context.data.message);
    const got = require('got');
    let auth = 'V3t07s08t:QvVdwNzApVRNs';

    function getRxRefNumber(id) {
      return context.app.service('rx').get(id);
    }

    let refillRequest = [
      { Message: [ { _attr: { version: '010', release: '006', xmlns: 'http://www.ncpdp.org/schema/SCRIPT'} },
          { Header: [ {
              To: [ {_attr: { Qualifier: obj.message.header[0].from[0].$.Qualifier } }, obj.message.header[0].from[0]._ ] }, {
              From: [ { _attr: { Qualifier: obj.message.header[0].to[0].$.Qualifier } } , obj.message.header[0].to[0]._ ] }, {
              MessageID: btoa(rxRefNum.rxId)},{
              RelatesToMessageID: obj.message.header[0].messageid[0]}, {
              SentTime: (new Date()).toISOString() }, {
              Security: [ { Sender: [ { TertiaryIdentification: obj.message.header[0].security[0].receiver[0].tertiaryidentification[0] } ] }, {
                Receiver: [ { TertiaryIdentification: obj.message.header[0].security[0].sender[0].tertiaryidentification[0] } ] } ] }, {
              RxReferenceNumber: rxRefNum.rxId },{
              PrescriberOrderNumber: obj.message.header[0].prescriberordernumber[0] } ] },
          { Body: [ {
              RefillRequest: [ {
                Pharmacy: [ {
                  Identification: [
                    (obj.message.body[0].newrx[0].pharmacy[0].identification[0]).hasOwnProperty('npi') ? {
                      NPI: obj.message.body[0].newrx[0].pharmacy[0].identification[0].npi[0] } : 1831637636,
                    (obj.message.body[0].newrx[0].pharmacy[0].identification[0]).hasOwnProperty('ncpdpid') ? {
                      NCPDPID: obj.message.body[0].newrx[0].pharmacy[0].identification[0].ncpdpid[0] } : ''
                  ] }, {
                  StoreName: obj.message.body[0].newrx[0].pharmacy[0].storename[0] },
                  (obj.message.body[0].newrx[0].pharmacy[0]).hasOwnProperty('address') ? {
                    Address: [ (obj.message.body[0].newrx[0].pharmacy[0].address[0]).hasOwnProperty('addressline1') ? {
                      AddressLine1: obj.message.body[0].newrx[0].pharmacy[0].address[0].addressline1[0] } : {} ,
                      (obj.message.body[0].newrx[0].pharmacy[0].address[0]).hasOwnProperty('city') ? {
                        City: obj.message.body[0].newrx[0].pharmacy[0].address[0].city[0] } : {},
                      (obj.message.body[0].newrx[0].pharmacy[0].address[0]).hasOwnProperty('state') ? {
                        State: obj.message.body[0].newrx[0].pharmacy[0].address[0].state[0] } : {},
                      (obj.message.body[0].newrx[0].pharmacy[0].address[0]).hasOwnProperty('zipcode') ? {
                        ZipCode: obj.message.body[0].newrx[0].pharmacy[0].address[0].zipcode[0] } : {} ] } : {
                    Address: [ { AddressLine1: 'Maxwell Suite 54'},{
                      City: 'Irving'}, {State: 'TX'},{ZipCode: 78035} ] },
                  (obj.message.body[0].newrx[0].pharmacy[0]).hasOwnProperty('communicationnumbers')? {
                    CommunicationNumbers: [ {
                      Communication: [ {
                        Number: obj.message.body[0].newrx[0].pharmacy[0].communicationnumbers[0].communication[0].number[0] }, {
                        Qualifier: obj.message.body[0].newrx[0].pharmacy[0].communicationnumbers[0].communication[0].qualifier[0] } ]
                    } ]
                  } : {}
                ] }, {
                Prescriber: [ {
                  Identification: [ (obj.message.body[0].newrx[0].prescriber[0].identification[0]).hasOwnProperty('statelicensenumber')? {
                    StateLicenseNumber: obj.message.body[0].newrx[0].prescriber[0].identification[0].statelicensenumber[0] } : {},
                    (obj.message.body[0].newrx[0].prescriber[0].identification[0]).hasOwnProperty('npi')? {
                      NPI: obj.message.body[0].newrx[0].prescriber[0].identification[0].npi[0] } : {},
                    (obj.message.body[0].newrx[0].prescriber[0].identification[0]).hasOwnProperty('deanumber')? {
                      DEANumber: obj.message.body[0].newrx[0].prescriber[0].identification[0].deanumber[0] } : {} ] },
                  (obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('name') ? {
                    Name: [ {
                      LastName: obj.message.body[0].newrx[0].prescriber[0].name[0].lastname[0] },
                      (obj.message.body[0].newrx[0].prescriber[0].name[0]).hasOwnProperty('firstname')? {
                        FirstName: obj.message.body[0].newrx[0].prescriber[0].name[0].firstname[0] } : {} ] } : {},
                  (obj.message.body[0].newrx[0].prescriber[0]).hasOwnProperty('communicationnumbers')? {
                    CommunicationNumbers: [ {
                      Communication: [ {
                        Number: obj.message.body[0].newrx[0].prescriber[0].communicationnumbers[0].communication[0].number[0] }, {
                        Qualifier: obj.message.body[0].newrx[0].prescriber[0].communicationnumbers[0].communication[0].qualifier[0] } ] } ] } : {} ] }, {
                Patient: [ {
                  Name: [ {
                    LastName: obj.message.body[0].newrx[0].patient[0].name[0].lastname[0] }, {
                    FirstName: obj.message.body[0].newrx[0].patient[0].name[0].firstname[0] } ] }, {
                  Gender: obj.message.body[0].newrx[0].patient[0].gender[0] }, {
                  DateOfBirth: [ {
                    Date: obj.message.body[0].newrx[0].patient[0].dateofbirth[0].date[0] } ] },
                  (obj.message.body[0].newrx[0].patient[0]).hasOwnProperty('address') ? {
                    Address: [
                      (obj.message.body[0].newrx[0].patient[0].address[0]).hasOwnProperty('addressline1') ? {
                        AddressLine1: obj.message.body[0].newrx[0].patient[0].address[0].addressline1[0] } : {},
                      (obj.message.body[0].newrx[0].patient[0].address[0]).hasOwnProperty('city') ? {
                        City: obj.message.body[0].newrx[0].patient[0].address[0].city[0] } : {} ,
                      (obj.message.body[0].newrx[0].patient[0].address[0]).hasOwnProperty('state') ? {
                        State: obj.message.body[0].newrx[0].patient[0].address[0].state[0] } : {} ,
                      (obj.message.body[0].newrx[0].patient[0].address[0]).hasOwnProperty('zipcode') ? {
                        ZipCode: obj.message.body[0].newrx[0].patient[0].address[0].zipcode[0] } : {}  ] } : {}, ] },{
                MedicationPrescribed: [ {
                  DrugDescription: obj.message.body[0].newrx[0].medicationprescribed[0].drugdescription[0] },
                  (obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('drugcoded')? {
                  DrugCoded: [ {
                    ProductCode: obj.message.body[0].newrx[0].medicationprescribed[0].drugcoded[0].productcode[0] }, {
                    ProductCodeQualifier: obj.message.body[0].newrx[0].medicationprescribed[0].drugcoded[0].productcodequalifier[0] } ] }: {},
                  (obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('quantity') ? {
                      Quantity: [ (obj.message.body[0].newrx[0].medicationprescribed[0].quantity[0]).hasOwnProperty('value') ? {
                        Value: obj.message.body[0].newrx[0].medicationprescribed[0].quantity[0].value[0] } : {}, {
                        CodeListQualifier: obj.message.body[0].newrx[0].medicationprescribed[0].quantity[0].codelistqualifier[0] }, {
                        UnitSourceCode: obj.message.body[0].newrx[0].medicationprescribed[0].quantity[0].unitsourcecode[0] }, {
                        PotencyUnitCode: obj.message.body[0].newrx[0].medicationprescribed[0].quantity[0].potencyunitcode[0] } ] }
                    : {
                      Quantity: [ {
                        Value: 35 }, {
                        CodeListQualifier: 38 }, {
                        UnitSourceCode: 'AC' }, {
                        PotencyUnitCode: 'C48542' } ] },
                  (obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('dayssupply') ?  {
                    DaysSupply: obj.message.body[0].newrx[0].medicationprescribed[0].dayssupply[0] } : {},
                  {
                    Directions: obj.message.body[0].newrx[0].medicationprescribed[0].directions[0] },
                  // {
                  //   Refills: [ {
                  //     Qualifier: 'R' }, {
                  //     Value: 1 } ] },
                  {
                    Substitutions: 1 }, {
                    WrittenDate: [ (obj.message.body[0].newrx[0].medicationprescribed[0].writtendate[0]).hasOwnProperty('date') ? {
                        Date: obj.message.body[0].newrx[0].medicationprescribed[0].writtendate[0].date[0] } :
                      (obj.message.body[0].newrx[0].medicationprescribed[0].writtendate[0]).hasOwnProperty('datetime') ? {
                        Date: obj.message.body[0].newrx[0].medicationprescribed[0].writtendate[0].datetime[0] } : '' ] } ] }, {
                MedicationDispensed: [ {
                  DrugDescription: obj.message.body[0].newrx[0].medicationprescribed[0].drugdescription[0] },
                  (obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('drugcoded')? {
                  DrugCoded: [ {
                    ProductCode: obj.message.body[0].newrx[0].medicationprescribed[0].drugcoded[0].productcode[0] }, {
                    ProductCodeQualifier: obj.message.body[0].newrx[0].medicationprescribed[0].drugcoded[0].productcodequalifier[0] } ] }: {},
                  (obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('quantity') ? {
                      Quantity: [ (obj.message.body[0].newrx[0].medicationprescribed[0].quantity[0]).hasOwnProperty('value') ? {
                        Value: obj.message.body[0].newrx[0].medicationprescribed[0].quantity[0].value[0] } : {}, {
                        CodeListQualifier: obj.message.body[0].newrx[0].medicationprescribed[0].quantity[0].codelistqualifier[0] }, {
                        UnitSourceCode: obj.message.body[0].newrx[0].medicationprescribed[0].quantity[0].unitsourcecode[0] }, {
                        PotencyUnitCode: obj.message.body[0].newrx[0].medicationprescribed[0].quantity[0].potencyunitcode[0] } ] }
                    : {
                      Quantity: [ {
                        Value: 35 }, {
                        CodeListQualifier: 38 }, {
                        UnitSourceCode: 'AC' }, {
                        PotencyUnitCode: 'C48542' } ] },
                  (obj.message.body[0].newrx[0].medicationprescribed[0]).hasOwnProperty('dayssupply') ?  {
                    DaysSupply: obj.message.body[0].newrx[0].medicationprescribed[0].dayssupply[0] } : {},
                  {
                    Directions: obj.message.body[0].newrx[0].medicationprescribed[0].directions[0] },
                  // {
                  //   Refills: [ {
                  //     Qualifier: 'R' }, {
                  //     Value: 1 } ] },
                  {
                    Substitutions: 0 }, {
                    WrittenDate: [ (obj.message.body[0].newrx[0].medicationprescribed[0].writtendate[0]).hasOwnProperty('date') ? {
                        Date: obj.message.body[0].newrx[0].medicationprescribed[0].writtendate[0].date[0] } :
                      (obj.message.body[0].newrx[0].medicationprescribed[0].writtendate[0]).hasOwnProperty('datetime') ? {
                        DateTime: obj.message.body[0].newrx[0].medicationprescribed[0].writtendate[0].datetime[0] } : '' ] }, {
                    LastFillDate: [ (obj.message.body[0].newrx[0].medicationprescribed[0].writtendate[0]).hasOwnProperty('date') ? {
                        Date: obj.message.body[0].newrx[0].medicationprescribed[0].writtendate[0].date[0] } :
                      (obj.message.body[0].newrx[0].medicationprescribed[0].writtendate[0]).hasOwnProperty('datetime') ? {
                        DateTime: obj.message.body[0].newrx[0].medicationprescribed[0].writtendate[0].datetime[0] } : '' ] } ] } ] } ] } ] } ];

    console.log('request to surescripts: ',xml(refillRequest, true));

    // const fetch = require('node-fetch');
    // const http = require('http');

    let request123 = require('request');


    // let nonsecure = require('follow-redirects').http;
    // let secure = require('follow-redirects').https;
    //
    // secure.get('https://smr-staging.surescripts.net/Vectorsoft/AuthenticatingXmlServer.aspx', function (response) {
    //   response.on('data', function (chunk) {
    //     console.log(chunk);
    //   });
    // }).on('error', function (err) {
    //   console.error(err);
    // });


    let options = {
      port: '443',
      method: 'POST',
      timeout:5000,
      // cert:crtPath,
      body: xml(refillRequest, { declaration: true }),
      headers: {
        // 'Authorization': 'Basic '+ btoa(auth),
        'Content-Type': 'application/xml'
      },
    };

// let response = await got('https://staging.surescripts.net/Vectorsoft/AuthenticatingXmlServer.aspx',options);

    context.result = await (async () => {
      // try {
      //   let response = await got('https://smr-staging.surescripts.net/Vectorsoft/AuthenticatingXmlServer.aspx',options);
      //   console.log('Response Body:',response.body);
      //   return response.body;
      // } catch (error) {
      //   console.log('Error Body:',error);
      //   return error;
      // }

      try {
        request123.post({url: 'https://smr-staging.surescripts.net/Vectorsoft/AuthenticatingXmlServer.aspx', port: '443', body: xml(refillRequest, { declaration: true}), agentOptions: { cert: crtPath, key: keyPath}, headers: {'Content-Type': 'application/xml'}}, function (error, response, body) {
          console.log('error:', error); // Print the error if one occurred
          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          console.log('body:', body); // Print the HTML for the Google homepage.
          return body;
        });

      } catch (error) {
        console.log('Error Body:',error);
        return error;
      }


      // try {
      //   fetch('https://smr-staging.surescripts.net/Vectorsoft/AuthenticatingXmlServer.aspx', {
      //     port: '443',
      //     method: 'post',
      //     body:    xml(refillRequest, { declaration: true }),
      //     headers: { 'Content-Type': 'application/xml' },
      //   }).then(res => {
      //       console.log('res.body',res.body);
      //       return res.body;
      //     });
      // } catch (error) {
      //   console.log('Error Body:',error);
      //   return error;
      // }
    })();
    return context;
  };
};
