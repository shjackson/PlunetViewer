import { BaseError } from "./base";

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(400, message);
  }
}
