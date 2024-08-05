import { BaseError } from "./base";

export class PlunetError extends BaseError {
  constructor(message: string) {
    super(500, message);
  }
}
