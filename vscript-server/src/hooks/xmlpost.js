// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  return async context => {
    console.log('context.result', context.result);
    if(Object.keys(context.result.message.body[0])[0] === 'newrx') {
console.log('newrx True:');
    }
    let obj = JSON.parse(context.result.message);
    console.log('message:',obj.message.header[0].from[0].$.Qualifier);
    let sentTime = new Date();
    let successXml = `<?xml version="1.0" encoding="UTF-8"?>
                        <Message xmlns="http://www.ncpdp.org/schema/SCRIPT"
                        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="010" release="006" xsi:schemaLocation="http://www.ncpdp.org/schema/SCRIPT SS_SCRIPT_XML_10_6MU.xsd">
                          <Header>
                            <To Qualifier="`+ obj.message.header[0].from[0].$.Qualifier + `">` + context.result.senderId +`</To>
                        <From Qualifier="`+ obj.message.header[0].to[0].$.Qualifier + `">` + context.result.receipientId +`</From>
                        <MessageID>`+context.result.messageId+`</MessageID>
                            <RelatesToMessageID></RelatesToMessageID>
                            <SentTime>`+ sentTime.toISOString() + `</SentTime>
                            <Security>
                              <Sender>
                                <TertiaryIdentification>`+ obj.message.header[0].security[0].sender[0].tertiaryidentification[0] +`</TertiaryIdentification>
                              </Sender>
                              <Receiver>
                                <TertiaryIdentification>`+ obj.message.header[0].prescriberordernumber[0] +`</TertiaryIdentification>
                              </Receiver>
                            </Security>
                            <RxReferenceNumber></RxReferenceNumber>
                            <PrescriberOrderNumber>`+ obj.message.header[0].prescriberordernumber[0] + `</PrescriberOrderNumber>
                          </Header>
                          <Body>
                            <Status>
                              <Code>000</Code>
                            </Status>
                          </Body>
                        </Message>`;
      context.result= successXml;
    return context;
  };
};
