import { createClientAsync } from 'soap';
import { DefaultSoapConnectionOptions, validatePlunetResponse } from './utils';

const wsdl = process.env['PLUNET_DATA_JOB_WSDL'] || '';
if (!wsdl) {
  throw new Error('Missing env variable PLUNET_DATA_JOB_WSDL');
}

export class DataJob {
  async getJobListForView(options: GetJobListForViewOptions): Promise<any> {
    const client = await createClientAsync(wsdl, DefaultSoapConnectionOptions());
    const data = await client.getJobList_ForViewAsync(options);
    return data;
  }

  async getJobListOfItemForView(options: GetJobListOfItemForViewOptions): Promise<any> {
    const client = await createClientAsync(wsdl, DefaultSoapConnectionOptions());
    const data = await client.getJobListOfItem_ForViewAsync(options);
    return data;
  }

  async getJobForView(options: GetJobForViewOptions): Promise<any> {
    const client = await createClientAsync(wsdl, DefaultSoapConnectionOptions());
    const getJobForViewResponse = await client.getJob_ForViewAsync(options);
    return validatePlunetResponse(getJobForViewResponse, 'JobResult');
  }

  async getJobMetrics(options: GetJobMetricsOptions): Promise<any> {
    //console.log(`${JSON.stringify(options)}`);
    const client = await createClientAsync(wsdl, DefaultSoapConnectionOptions());
    const getJobMetricsResponse = await client.getJobMetricsAsync(options);
    return validatePlunetResponse(getJobMetricsResponse, 'JobMetricResult', options);
  }
}

export interface GetJobMetricsOptions {
  UUID: string;
  jobID: string;
  projectType: number;
  languageCode: string;
}

export interface GetJobListForViewOptions {
  UUID: string;
  jobIDs: string;
  projectType: number;
}

export interface GetJobListOfItemForViewOptions {
  UUID: string;
  itemID: string;
  projectType: number;
}

export interface GetJobForViewOptions {
  UUID: string;
  jobID: string;
  projectType: number;
}

export interface SearchResponse {
  IntegerArrayResult: {
    statusCode: string;
    statusCodeAlphanumeric: string;
    statusMessage: string;
    data?: string[];
  }
}
