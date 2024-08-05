import _ from 'lodash';
import { DataCustomer } from './data-customer';
import nock from 'nock';
import path from 'path';
import { loadNockedDataCustomerWSDL } from './mocks/data-customer';

let token: string;
const dataItem = new DataCustomer();

describe('Data Customer Web Service', () => {
  beforeAll(() => {
    loadNockedDataCustomerWSDL();

    nock('https://plunet.tbo.group')
    .post('/DataCustomer30', /.*\:getAllCustomerObjects.*/)
    .replyWithFile(200, path.join(__dirname, 'mocks/data-customer/getAllCustomerObjects/status-1.xml'));
  });

  afterAll(() => {
    nock.cleanAll();
  });
  describe('getAllCustomerObjets', () => {
    it('should return the data of all', async() => {
      const result = await dataItem.getAllCustomerObjets({
        UUID: token,
        Status: '1',
      });
      expect(result.length).toBe(3355);
    });
  });
});
