import nock from "nock";
import path from "path";

export function loadNockedDataCustomerWSDL() {
  nock('https://plunet.tbo.group')
  .get('/DataCustomer30?wsdl')
  .replyWithFile(200, path.join(__dirname, 'wsdl.xml'));
  nock('https://plunet.tbo.group')
  .get('/DataCustomer30?xsd=1')
  .replyWithFile(200, path.join(__dirname, 'wsdl.xsd'));
}