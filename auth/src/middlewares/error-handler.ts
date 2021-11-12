import { ErrorRequestHandler} from 'express';
import { BaseError } from '../errors/base-error';

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  let status;
  let errors;

  switch(Object.getPrototypeOf(err.constructor)) {
    case BaseError:
      status = err.httpStatus;
      errors = err.serialize();
      break;
    default:
      status = 400
      errors = [{ message: err.message }]
      break;
  }

  res
    .status(status)
    .send({ errors: errors});
};
