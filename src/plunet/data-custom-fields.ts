import { createClientAsync } from 'soap';
import { DefaultSoapConnectionOptions } from './utils';

const wsdl = process.env['PLUNET_DATA_CUSTOM_FIELDS_WSDL'] || '';
if (!wsdl) {
  throw new Error('Missing env variable PLUNET_DATA_CUSTOM_FIELDS_WSDL');
}

export class DataCustomFields {
  async getProperty(options: GetPropertyRequest): Promise<any> {
    const client = await createClientAsync(wsdl, DefaultSoapConnectionOptions());
    const getPropertyResponse = await client.getPropertyAsync(options);
    console.dir(getPropertyResponse, {depth: null});
    if (!getPropertyResponse[0].IntegerArrayResult.data) {
      throw new Error('Error at getProperty');
    }
    return getPropertyResponse;
  }
}

export interface GetPropertyRequest {
  UUID: string;
  PropertyNameEnglish: string;
  PropertyUsageArea: number;
  MainID: string;
}
