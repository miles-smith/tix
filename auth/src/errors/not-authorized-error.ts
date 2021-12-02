import { BaseError } from './base-error';

export class NotAuthorizedError extends BaseError {
  httpStatus = 401;

  constructor(message = 'Not Authorized') {
    super(message);

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serialize() {
    return [{ message: this.message }];
  }
}
