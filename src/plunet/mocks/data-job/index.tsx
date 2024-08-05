import nock from "nock";
import path from "path";

export function loadNockedDataJobWSDL() {
  nock('https://plunet.tbo.group')
  .get('/DataJob30?wsdl')
  .replyWithFile(200, path.join(__dirname, 'wsdl.xml'));
  nock('https://plunet.tbo.group')
  .get('/DataJob30?xsd=1')
  .replyWithFile(200, path.join(__dirname, 'wsdl.xsd'));
}