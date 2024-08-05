import _ from "lodash";
import { IOptions } from "soap";
import { PlunetError } from "../errors/plunet";

//import axios from "axios";
const delayCycle = 10;
let delayCoefficient = 0;

export function resetDelayCoefficient() {
  delayCoefficient = 0;
}

export function DefaultSoapConnectionOptions():IOptions {
  return {
    forceSoap12Headers: true
  };
}
export function validatePlunetResponse(response: any, contentTag: string, options?: any) {
  if (_.get(response[0], `${contentTag}.statusCode`) === '-5') {
    console.log(`token invalido en ${contentTag} with options ${options}`);
    throw new PlunetError('Invalid Plunet Token');
  }
  const data = _.get(response[0], `${contentTag}.data`);
  if (_.isUndefined(data)) {
    if (_.get(response[0], `${contentTag}.statusCode`) === '0') {
      return [];
    }
    console.log(`${JSON.stringify(response[0])} - ${JSON.stringify(options)}`);
    throw new PlunetError('Invalid Plunet Response');
  }
  return data;
}

