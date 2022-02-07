import { BaseError } from './base-error';

export class BadRequestError extends BaseError {
  httpStatus = 400;

  constructor(public message: string = 'Bad Request') {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serialize() {
    return [{ message: this.message }];
  }
}
