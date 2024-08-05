import { createClientAsync } from 'soap';
import { DefaultSoapConnectionOptions, validatePlunetResponse } from './utils';
import _ from 'lodash';

const wsdl = process.env['PLUNET_DATA_ORDER_WSDL'] || '';
if (!wsdl) {
  throw new Error('Missing env variable PLUNET_DATA_ORDER_WSDL');
}

export class DataOrder {
  async search(options: SearchOptions): Promise<string[]> {
    const client = await createClientAsync(wsdl, DefaultSoapConnectionOptions());
    const searchResponse = await client.searchAsync(options);
    return validatePlunetResponse(searchResponse, 'IntegerArrayResult', options);
  }

  async getOrderObject(options: GetOrderObjectOptions): Promise<any> {
    const client = await createClientAsync(wsdl, DefaultSoapConnectionOptions());
    const getOrderObjecResponse = await client.getOrderObjectAsync(options);
    return validatePlunetResponse(getOrderObjecResponse, 'OrderResult', options);
  }

  async getOrderObjectList(options: GetObjectOrderListOptions): Promise<any> {
    const client = await createClientAsync(wsdl, DefaultSoapConnectionOptions());
    const getOrderObjectListResponse = await client.getOrderObjectListAsync(options);
    return validatePlunetResponse(getOrderObjectListResponse, 'OrderListResult', options);
  }

  async getProperty(options: GetPropertyOptions): Promise<any> {
    const client = await createClientAsync(wsdl, DefaultSoapConnectionOptions());
    const getPropertyResponse = await client.getPropertyAsync(options);
    if (_.get(getPropertyResponse[0], `StringResult.statusCode`) === '-3') {
      console.log(`negreando esto aca para ${JSON.stringify(options)}`);
      _.set(getPropertyResponse[0], `StringResult.data`, null);
    }
    return validatePlunetResponse(getPropertyResponse, 'StringResult', options);
  }
}

export interface GetOrderObjectOptions {
  UUID: string;
  orderID: string;
}

export interface GetObjectOrderListOptions {
  UUID: string;
  orderIDList: {
    integerList: string[];
  }
}

export interface GetPropertyOptions {
  UUID: string;
  orderID: string;
  propertyNameEnglish: string;
}

export interface SearchOptions {
  UUID: string;
  SearchFilter: {
    customerId?: number;
    itemStatus?: number;
    languageCode: string;
    orderStatus: number;
    projectType: number;
    statusProjectFileArchiving: number;
    timeFrame: {
      dateFrom: string;
      dateTo: string;
      dateRelation: number;
    }
  }
}

export const DefaultSearchOptions: SearchOptions = {
  UUID: '',
  SearchFilter: {
    customerId: -1,
    languageCode: 'EN',
    orderStatus: -1,
    projectType: -1,
    statusProjectFileArchiving: -1,
    timeFrame: {
      dateFrom: '',
      dateTo: '',
      dateRelation: 1
    },
  }
}
