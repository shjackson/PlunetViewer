import { DataOrder, DefaultSearchOptions } from './data-order';
import _ from 'lodash';

let token: string;
const dataOrder = new DataOrder();
import nock from 'nock';
import path from 'path';
import { loadNockedDataOrderWSDL } from './mocks/data-order';

describe('Data Order Web Service', () => {
  beforeAll(() => {
    loadNockedDataOrderWSDL();

    nock('https://plunet.tbo.group')
    .post('/DataOrder30', /.*\:search.*2024-05-04.*/)
    .replyWithFile(200, path.join(__dirname, 'mocks/data-order/search/2024-05-04.xml'));

    nock('https://plunet.tbo.group')
    .post('/DataOrder30', /.*\:getOrderObjectList.*2247213.*/)
    .replyWithFile(200, path.join(__dirname, 'mocks/data-order/getOrderObjectList/2247213.xml'));
  });

  afterAll(() => {
    nock.cleanAll();
  });

  describe('search', () => {
    it('should get the orders from a specific date range', async() => {
      const searchOptions = _.cloneDeep(DefaultSearchOptions);
      searchOptions.UUID = token;
      searchOptions.SearchFilter.timeFrame.dateFrom = '2024-05-04';
      searchOptions.SearchFilter.timeFrame.dateTo = '2024-05-04';
      const result = await dataOrder.search(searchOptions);
      expect(result.length).toBe(139);
    });
  });
  describe('getOrderObjectList', () => {
    it('Get a list of orders based on a list of order IDs', async() => {
      const getObjectOrderListOptions = {
        UUID: token,
        orderIDList: {
          integerList: ['2247213']
        }
      }
      const result = await dataOrder.getOrderObjectList(getObjectOrderListOptions);
      expect(result).toStrictEqual([
        {
          currency: 'USD',
          customerContactID: '2439',
          customerID: '406',
          deliveryDeadline: '2023-05-22T10:30:00-03:00',
          orderClosingDate: '2023-08-08T12:10:32-03:00',
          orderDate: '2023-05-22T01:20:00-03:00',
          orderDisplayName: 'O-23-12642',
          orderID: '2247213',
          projectManagerID: '2308',
          projectName: 'Project#: 988400 - Fairfax County - NCS - Office for Children (OFC) - English to Korean - TR_OTHER & ED - New Work Request: 2790399',
          rate: '1.0',
          requestID: '0',
          subject: null
        }
      ]);
    });
  });
});
