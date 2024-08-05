import { createClientAsync } from 'soap';
import { DefaultSoapConnectionOptions } from './utils';

const wsdl = process.env['PLUNET_REPORT_JOB_WSDL'] || '';
if (!wsdl) {
  throw new Error('Missing env variable PLUNET_REPORT_JOB_WSDL');
}

export class ReportJob {
  async search(options: SearchOptions): Promise<SearchResponse[]> {
    const client = await createClientAsync(wsdl, DefaultSoapConnectionOptions());
    const searchResponse = await client.searchAsync(options);
    if (!searchResponse[0].IntegerArrayResult.data) {
      throw new Error('Error at search');
    }
    return searchResponse[0].IntegerArrayResult.data;
  }
}

export interface SearchOptions {
  UUID: string;
  SearchFilter_Job: {
    customerId?: number;
    item_Status?: number;
    job_CreationDate_from?: string;
    job_CreationDate_to?: string;
    job_SourceLanguage?: string;
    job_Status?: number;
    job_TargetLanguage?: string;
    job_resourceID?: number;
  }
}

export interface SearchResponse {
  IntegerArrayResult: {
    statusCode: string;
    statusCodeAlphanumeric: string;
    statusMessage: string;
    data?: string[];
  }
}
export const DefaultSearchOptions: SearchOptions = {
  UUID: '',
  SearchFilter_Job: {
    customerId: -1,
    item_Status: -1,
    job_CreationDate_from: '',
    job_CreationDate_to: '',
    job_Status: -1,
    job_resourceID: -1,
  }
}