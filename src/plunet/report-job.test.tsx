import nock from 'nock';
import { ReportJob, DefaultSearchOptions } from './report-job';
import _ from 'lodash';
import path from 'path';
import { loadNockedReportJobWSDL } from './mocks/report-job';

let token: string;
const reportJob = new ReportJob();


describe('Report Job Web Service', () => {
  beforeAll(() => {
    loadNockedReportJobWSDL();

    nock('https://plunet.tbo.group')
    .post('/ReportJob30', /.*\:search.*2023-05-04.*/)
    .replyWithFile(200, path.join(__dirname, 'mocks/report-job/search/2023-05-04.xml'));

  });

  afterAll(() => {
    nock.cleanAll();
  });

  describe('search', () => {
    it('Return a list of Job IDs based of a date range', async () => {
      const searchOptions = _.cloneDeep(DefaultSearchOptions);
      searchOptions.UUID = token;
      searchOptions.SearchFilter_Job.job_CreationDate_from = '2023-05-04';
      searchOptions.SearchFilter_Job.job_CreationDate_to = '2023-05-04';
      const result = await reportJob.search(searchOptions);
      expect(result.length).toBe(253);
    });
  })
});