import _ from 'lodash';
import { DataJob } from './data-job';
import nock from 'nock';
import path from 'path';
import { loadNockedDataJobWSDL } from './mocks/data-job';

let token: string;
const dataJob = new DataJob();

describe('Data Job Web Service', () => {
  beforeAll(() => {
    loadNockedDataJobWSDL();

    nock('https://plunet.tbo.group')
    .post('/DataJob30', /.*\:getJobMetrics.*287457.*/)
    .replyWithFile(200, path.join(__dirname, 'mocks/data-job/getJobMetrics/287457.xml'));

    nock('https://plunet.tbo.group')
    .post('/DataJob30', /.*\:getJob_ForView.*287457.*/)
    .replyWithFile(200, path.join(__dirname, 'mocks/data-job/getJob_ForView/287457.xml'));
  });

  afterAll(() => {
    nock.cleanAll();
  });

  describe('getJobMetrics', () => {
    it('should get metrics from a job', async() => {
      const result = await dataJob.getJobMetrics({
        UUID: token,
        projectType: 3,
        jobID: '287457',
        languageCode: 'EN'
      });
      expect(result).toStrictEqual({
        amounts: {
          baseUnitName: 'Words',
          grossQuantity: '19.0',
          netQuantity: '19.0',
          serviceType: 'Translation'
        },
        totalPrice: '0.95',
        totalPriceJobCurrency: '0.95'
      });
    });
  });
  describe('getJobForView', () => {
    it('should get data of a specific job', async() => {
      const result = await dataJob.getJobForView({
        UUID: token,
        projectType: 3,
        jobID: '287457',
      });
      expect(result).toStrictEqual({
        countSourceFiles: '0',
        dueDate: '2023-05-23T11:00:00-03:00',
        itemID: '161156',
        jobID: '287457',
        jobTypeFull: 'Translation',
        jobTypeShort: 'TRA',
        projectID: '2247303',
        projectType: '3',
        resourceID: '2139',
        startDate: '2023-05-23T05:00:00-03:00',
        status: '6'
      });
    });
  });
});
