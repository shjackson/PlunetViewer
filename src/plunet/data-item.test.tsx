import _ from 'lodash';
import { DataItem } from './data-item';
import nock from 'nock';
import path from 'path';
import { loadNockedDataItemWSDL } from './mocks/data-item';

let token: string;
const dataItem = new DataItem();


describe('Data Item Web Service', () => {
  beforeAll(() => {
    loadNockedDataItemWSDL();

    nock('https://plunet.tbo.group')
    .post('/DataItem30', /.*\:getItemObject.*146948.*/)
    .replyWithFile(200, path.join(__dirname, 'mocks/data-item/getItemObject/146948.xml'));

    nock('https://plunet.tbo.group')
    .post('/DataItem30', /.*\:getAllItems.*2238103.*/)
    .replyWithFile(200, path.join(__dirname, 'mocks/data-item/getAllItems/2238103.xml'));
  });

  afterAll(() => {
    nock.cleanAll();
  });

  describe('getItemObject', () => {
    it('should return the data of a specific item', async () => {
      const result = await dataItem.getItemObject({
        UUID: token,
        projectType: 3,
        itemID: '146948',
      });
      expect(result).toStrictEqual({
        briefDescription: 'English (United States)/Spanish (United States) - O-24862-Interfaith Power & Light',
        deliveryDeadline: '2023-02-14T17:00:00-03:00',
        invoiceID: '9270',
        itemID: '146948',
        jobIDList: [ '266986', '266987' ],
        orderID: '0',
        projectID: '2238103',
        projectType: '3',
        sourceLanguage: 'English (United States)',
        status: '9',
        targetLanguage: 'Spanish (United States)',
        totalPrice: '21.9'
      });
    });
  });

  describe('getAllItemsByProject', () => {
    it('should return the item IDs of a specific order', async() => {
      const result = await dataItem.getAllItemsByProject({
        UUID: token,
        projectID: '2238103',
        projectType: 3
      });
      expect(result).toStrictEqual([ '146948', '161118', '161119', '161120', '161121' ]);
    })
  });
});