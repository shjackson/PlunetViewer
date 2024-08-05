import _ from "lodash";
import { PlunetConnector } from "./plunet-api";
const connector = new PlunetConnector();
let tokenLifetime: number = 30000;
let timestamp: number = new Date().getTime();

const delayCycle = 1000;
let delayCoefficient = 0;

console.log('DDDDDDDDDDD');

export async function getToken(): Promise<string> {
  const token = await connector.login();
  console.log('Token Generado: ' + token);
  const isValid = await connector.validate(token);
  console.log(`Is Valid? ${isValid}`);
  /*const currentTime = new Date().getTime();
  console.log(`Time difference: ${currentTime - timestamp}`);
  if (token === 'unset' || currentTime - timestamp > tokenLifetime) {
    console.log('seteando nuevo token');
    token = await connector.login();
    timestamp = new Date().getTime();
    delayCoefficient = 0;
  }*/
  //token = await connector.login();
  return isValid ? token : getToken();
};

export async function executeDelayed(func: Function, options: any): Promise<any> {
  return new Promise(resolve => setTimeout(resolve, delayCycle * delayCoefficient))
  //.then(() => connector.login(token))
  .then(async () => {
    delayCoefficient++;
    console.log(`executing ${func.name} in the cycle ${delayCoefficient} at ${new Date()}`);
    options.UUID = await getToken();
    //console.log('token es ' + options.UUID);
    return func(options);
  });
}

export async function executeWithRetrySimple(func: Function, options: any) {
  return func(options)
  .catch(async (err: undefined) => {
    console.log(`reintentando ${func.name} por ${(err as unknown as Error).message}...`);
    return executeWithRetrySimple(func, options);
  })
}

export async function executeWithRetry(func: Function, options: any) {
  return func(options)
  .then((data: any) => {
    //console.log(`retornando ${func.name} ... ${JSON.stringify(options)} : ${JSON.stringify(data)}`);
    //console.log({token: options.UUID, data });
    return {token: options.UUID, data };
  })
  .catch(async (err: undefined) => {
    console.log(`reintentando ${func.name} por ${(err as unknown as Error).message}...`);
    options.UUID = await getToken();
    return executeWithRetry(func, options);
  })
}

export async function executeAllWithRetry(func: Function, options: any[], afterRequest: Function): Promise<any> {
  //console.log(`${JSON.stringify(options)}`);
  const promises: any[] = [];
  let cycleOrder = 0;
  let cycleConstant = 10;
  for (const option of options) {
    //console.log(`${func.name} - ${JSON.stringify(option)}`)
    promises.push(new Promise(resolve => setTimeout(resolve, cycleOrder * cycleConstant))
    .then(() => func(option))
    .then((data) => afterRequest(data, option))
    .then((data) => {
      //console.log(`${func.name} - ${JSON.stringify(option)}`);
      return {token: option.UUID, data };
    }));
    cycleOrder++;
  }
  return Promise.all(promises)
  .then((promisesData) => {
    const data = _.map(promisesData, (promiseData) => promiseData.data);
    return {token: options[0].UUID, data};
  })
  .catch(async (err: undefined) => {
    console.log(`reintentando ${func.name} por ${(err as unknown as Error).message}...`);
    const token = await getToken();
    console.log(token);
    options = _.map(options, (option) => {
      option.UUID = token;
      return option;
    });
    return executeAllWithRetry(func, options, afterRequest);
  })
}
