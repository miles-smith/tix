import { BaseError } from './base-error';

export class RoutingError extends BaseError {
  httpStatus = 404;

  constructor(message: string = 'Route not found') {
    super(message);

    Object.setPrototypeOf(this, RoutingError.prototype);
  }

  serialize() {
    return [{ message: 'Not Found' }];
  }
}
