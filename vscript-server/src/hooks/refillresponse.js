// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    let obj = JSON.parse(context.data.message);
    console.log('context data:',obj);
    if(Object.keys(obj.message.body[0])[0] === 'cancelrx') {
      console.log('true');
      console.log('context messageid:',obj.message.header[0].messageid[0]);
      let xml = require('xml');
      let btoa = require('btoa');
      const got = require('got');
      let auth = 'V3t07s08t:QvVdwNzApVRNs';
      let cancelXml = [
        { Message: [ { _attr: { version: '010', release: '006', xmlns: 'http://www.ncpdp.org/schema/SCRIPT'} },
            { Header: [ {
                To: [ {_attr: { Qualifier: obj.message.header[0].from[0].$.Qualifier } }, obj.message.header[0].from[0]._ ] }, {
                From: [ { _attr: { Qualifier: obj.message.header[0].to[0].$.Qualifier } } , obj.message.header[0].to[0]._ ] }, {
                MessageID: obj.message.header[0].messageid[0]},{
                RelatesToMessageID: obj.message.header[0].relatestomessageid[0]}, {
                SentTime: (new Date()).toISOString() }, {
                Security: [ { Sender: [ { TertiaryIdentification: obj.message.header[0].security[0].receiver[0].tertiaryidentification[0] } ] }, {
                  Receiver: [ { TertiaryIdentification: obj.message.header[0].security[0].sender[0].tertiaryidentification[0] } ] } ] }, {
                RxReferenceNumber: obj.message.header[0].messageid[0] },{
                PrescriberOrderNumber: obj.message.header[0].prescriberordernumber[0] } ] },
            { Body: [ { CancelRxResponse: [ { Response: [ { Approved: { } } ] } ] } ] } ] } ];
      console.log('cancelRx',xml(cancelXml, true));

      //TODO
      // Need to send Reject Response also.. If user wants to reject

      let options = {
        port: '443',
        method: 'POST',
        timeout:5000,
        body: xml(cancelXml, { declaration: true }),
        headers: {
          'Authorization': 'Basic '+ btoa(auth),
          'Content-Type': 'application/xml'
        },
      };

      context.result = await (async () => {
        try {
          let response = await got('https://staging.surescripts.net/Vectorsoft/AuthenticatingXmlServer.aspx',options);
          console.log('Response Body:',response.body);
          return response.body;
        } catch (error) {
          console.log('Error Body:',error);
          return error;
        }
      })();
    }

    // if(Object.keys(context.data.message.body[0])[0] === 'cancelrx') {
    //   console.log('cancelrx true');
    //   console.log('elements:',context.data.message.header[0].from[0].$.Qualifier,context.data.message.header[0].from[0]._,
    //     context.data.message.header[0].to[0].$.Qualifier,context.data.message.header[0].to[0]._,
    //     context.data.message.header[0].messageid[0],context.data.message.header[0].security[0].receiver[0].tertiaryidentification[0],
    //     context.data.message.header[0].security[0].sender[0].tertiaryidentification[0],
    //     context.data.message.header[0].prescriberordernumber[0]);
    //
    //   let sentTime = new Date();
    //   let successXml = `<?xml version="1.0" encoding="UTF-8"?>
    //                     <Message xmlns="http://www.ncpdp.org/schema/SCRIPT"
    //                       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="010" release="006"
    //                       xsi:schemaLocation="http://www.ncpdp.org/schema/SCRIPT SS_SCRIPT_XML_10_6MU.xsd">
    //                       <Header>
    //                         <To Qualifier="`+context.data.message.header[0].from[0].$.Qualifier+`">`+context.data.message.header[0].from[0]._+`</To>
    //                         <From Qualifier="`+context.data.message.header[0].to[0].$.Qualifier+`">`+context.data.message.header[0].to[0]._+`</From>
    //                         <MessageID>123</MessageID>
    //                         <RelatesToMessageID>`+context.data.message.header[0].messageid[0]+`</RelatesToMessageID>
    //                         <SentTime>`+ sentTime.toISOString() +`</SentTime>
    //                         <Security>
    //                           <Sender>
    //                             <TertiaryIdentification>`+context.data.message.header[0].security[0].sender[0].tertiaryidentification[0]+`</TertiaryIdentification>
    //                           </Sender>
    //                           <Receiver>
    //                             <TertiaryIdentification>`+context.data.message.header[0].security[0].receiver[0].tertiaryidentification[0]+`</TertiaryIdentification>
    //                           </Receiver>
    //                         </Security>
    //                         <RxReferenceNumber>73737373</RxReferenceNumber>
    //                         <PrescriberOrderNumber>`+context.data.message.header[0].prescriberordernumber[0]+`</PrescriberOrderNumber>
    //                       </Header>
    //                       <Body>
    //                       <CancelRxResponse>
    //                       <Response>
    //                       <Approved/>
    //                       </Response>
    //                       </CancelRxResponse>
    //                       </Body>
    //                       </Message>`;
    //
    //   context.result= successXml;
    //
    // }
    // else if(Object.keys(context.data.message.body[0])[0] === 'refillresponse') {
    //   let xmlfile = context.data;
    //   let xml = JSON.stringify(xmlfile);
    //
    //   let notificationObject = {
    //     pharmacyNPI: context.data.message.body["0"].refillresponse["0"].pharmacy["0"].identification["0"].npi["0"],
    //     notificationFrom: 'surescripts',
    //     prescriber_npi: context.data.message.body["0"].refillresponse["0"].prescriber["0"].identification["0"].npi["0"],
    //     receipientId: context.data.message.header["0"].to["0"]._,
    //     senderId: context.data.message.header["0"].from["0"]._,
    //     messageId: context.data.message.header["0"].messageid["0"],
    //     sentDateTime: context.data.message.header["0"].senttime["0"],
    //     deleted: 'false',
    //     message: xml,
    //     status: 'unread'
    //   };
    //
    //   context.app.service('surescripts-notification').create(notificationObject)
    //     .then(result =>{
    //       console.log('sr result:', result);
    //     });
    //   // context.data = notificationObject;
    // }
    return context;
  };
};
