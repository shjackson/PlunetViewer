import { createClientAsync } from 'soap';
import { executeWithRetry, executeWithRetrySimple } from './context';
const plunetWsdl = process.env['PLUNET_WSDL'] || '';

const user = process.env['PLUNET_USER'] || '';
const pass = process.env['PLUNET_PASS'] || '';
if (!user || !pass) {
  throw new Error('Missing Plunet Configuration!!!!');
}

export class PlunetConnector {

  async login() {
    const client = await createClientAsync(plunetWsdl, {
      forceSoap12Headers: true,
    });
    const tokenData = await executeWithRetrySimple(client.loginAsync, {
      arg0: user,
      arg1: pass
    })
    return tokenData[0]['return'];
  }

  async validate(token: string) {
    const client = await createClientAsync(plunetWsdl, {
      forceSoap12Headers: true,
    });
    const validateData = await executeWithRetrySimple(client.validateAsync,{
      UUID: token,
      Username: user,
      Password: pass
    })
    //console.log(validateData[0]);
    return validateData[0].Result?.statusCode === '-12';
  }

  async logout(token: string) {
    const client = await createClientAsync(plunetWsdl, {
      forceSoap12Headers: true,
    });
    const tokenData = await executeWithRetrySimple(client.logoutAsync, {
      arg0: token
    })
    return tokenData;
  }

}