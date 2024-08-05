import nock from "nock";
import path from "path";

export function loadNockedReportJobWSDL() {
  nock('https://plunet.tbo.group')
  .get('/ReportJob30?wsdl')
  .replyWithFile(200, path.join(__dirname, 'wsdl.xml'));
  nock('https://plunet.tbo.group')
  .get('/ReportJob30?xsd=1')
  .replyWithFile(200, path.join(__dirname, 'wsdl.xsd'));
}