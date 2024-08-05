import { PlunetConnector } from './plunet-api';

describe.skip('Plunet API Web Service', () => {
  const connector = new PlunetConnector();
  describe.skip('login', () => {
    it('should return a token', async() => {
      const connection = await connector.login();
      console.log(connection);
    });
  });
  describe.skip('logout', () => {
    it('should logout a session', async() => {
      const connection = await connector.login();
      const result = await connector.logout(connection['return']);
      console.log(result);
    });
  });
});
