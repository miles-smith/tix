import { ValidationError } from 'express-validator';
import { BaseError } from './base-error';

export class RequestValidationError extends BaseError {
  httpStatus = 400;

  constructor(private errors: ValidationError[]) {
    super('Validation failure');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serialize() {
    return this.errors.map(error => {
      return { message: error.msg, field: error.param }
    });
  }
}
