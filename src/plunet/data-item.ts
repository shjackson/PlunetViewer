import { Client, createClientAsync } from 'soap';
import { DefaultSoapConnectionOptions, validatePlunetResponse } from './utils';
import _ from 'lodash';
const wsdl = process.env['PLUNET_DATA_ITEM_WSDL'] || '';
if (!wsdl) {
  throw new Error('Missing env variable PLUNET_DATA_ITEM_WSDL');
}
else {
  console.log('todo ok');
}
let dataItemClient: Client;
(async () => {
  console.log('creando CLIENT XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX');
  dataItemClient = await createClientAsync(wsdl, DefaultSoapConnectionOptions());
  console.log('WWWWWWWWWWWWWWWWWWWWWWWWWWW');
})();
export class DataItem {

  async getItemObject(options: GetItemObjectOptions): Promise<any> {
    if (!dataItemClient) {
      console.log(dataItemClient);
      console.log('-----------------------------------------------------creando cliente en getItemObject');
      dataItemClient = await createClientAsync(wsdl, DefaultSoapConnectionOptions());
    }
    const getItemObjectResponse = await dataItemClient.getItemObjectAsync(options);
    return validatePlunetResponse(getItemObjectResponse, 'ItemResult', options);
  }

  async getAllItemsByProject(options: GetAllItemsOptions): Promise<any> {
    if (!dataItemClient) {
      console.log(dataItemClient);
      console.log('-----------------------------------------------------creando cliente en getAllItemsByProject');
      dataItemClient = await createClientAsync(wsdl, DefaultSoapConnectionOptions());
    }
    const getAllItemsResponse = await dataItemClient.getAllItemsAsync(options);
    const validatedResponse = validatePlunetResponse(getAllItemsResponse, 'IntegerArrayResult', options);
    return _.flatten([validatedResponse]);
  }
  //getItemsByStatus2
  async getItemsByStatus(options: GetItemsByStatusOptions): Promise<any> {
    if (!dataItemClient) {
      console.log(dataItemClient);
      console.log('-----------------------------------------------------creando cliente en getItemsByStatus1');
      dataItemClient = await createClientAsync(wsdl, DefaultSoapConnectionOptions());
    }
    const getAllItemsResponse = await dataItemClient.getItemsByStatus1Async(options);
    const validatedResponse = validatePlunetResponse(getAllItemsResponse, 'ItemListResult', options);
    return _.flatten([validatedResponse]);
  }
}

export interface GetItemObjectOptions {
  UUID: string;
  itemID: string;
  projectType: number;
}

export interface GetAllItemsOptions {
  UUID: string;
  projectID: string;
  projectType: number;
}

export interface GetItemsByStatusOptions {
  UUID: string;
  status: number;
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
