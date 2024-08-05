import nock from "nock";
import path from "path";

export function loadNockedDataOrderWSDL() {
  nock('https://plunet.tbo.group')
  .get('/DataOrder30?wsdl')
  .replyWithFile(200, path.join(__dirname, 'wsdl.xml'));
  nock('https://plunet.tbo.group')
  .get('/DataOrder30?xsd=1')
  .replyWithFile(200, path.join(__dirname, 'wsdl.xsd'));
}