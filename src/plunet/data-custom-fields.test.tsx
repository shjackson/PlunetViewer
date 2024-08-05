import { PlunetConnector } from './plunet-api';
import _ from 'lodash';
import { DataCustomFields, GetPropertyRequest } from './data-custom-fields';

let token: string;
let connector = new PlunetConnector();
const dataCustomFields = new DataCustomFields();

describe.skip('Data Customer Fields Web Service', () => {
  beforeEach(async () => {
    token = await connector.login();
  });

  afterEach(async () => {
    await connector.logout(token);
  });
  describe.skip('getProperty', () => {
    it('should get the property', async() => {
      const customProperty = 'Price in selected currency';
      let getPropertyRequest: GetPropertyRequest = {
        UUID: token,
        PropertyNameEnglish: customProperty,
        PropertyUsageArea: 6,
        MainID: '2200978'
      };
      let result = await dataCustomFields.getProperty(getPropertyRequest);
      console.dir(result, {depth: null});
    });
  });
});
