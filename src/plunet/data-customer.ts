import { createClientAsync } from 'soap';
import { DefaultSoapConnectionOptions, validatePlunetResponse } from './utils';

const wsdl = process.env['PLUNET_DATA_CUSTOMER_WSDL'] || '';
if (!wsdl) {
  throw new Error('Missing env variable PLUNET_DATA_CUSTOMER_WSDL');
}

export class DataCustomer {
  async getAllCustomerObjets(options: GetAllCustomerObjetsOptions): Promise<any> {
    const client = await createClientAsync(wsdl, DefaultSoapConnectionOptions());
    const getAllCustomerObjectsResponse = await client.getAllCustomerObjectsAsync(options);
    return validatePlunetResponse(getAllCustomerObjectsResponse, 'CustomerListResult');
  }
}

export interface GetAllCustomerObjetsOptions {
  UUID: string;
  Status: string;
}

export interface SearchResponse {
  IntegerArrayResult: {
    statusCode: string;
    statusCodeAlphanumeric: string;
    statusMessage: string;
    data?: string[];
  }
}
