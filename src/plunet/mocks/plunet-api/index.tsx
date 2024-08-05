import nock from "nock";
import path from "path";

export function loadNockedPlunetApiWSDL() {
  nock('https://plunet.tbo.group')
  .get('/PlunetAPI?wsdl')
  .replyWithFile(200, path.join(__dirname, 'wsdl.xml'));
  nock('https://plunet.tbo.group')
  .get('/PlunetAPI?xsd=1')
  .replyWithFile(200, path.join(__dirname, 'wsdl.xsd'));
}