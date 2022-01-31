import { Request, Response, NextFunction } from 'express';
import { NotAuthorizedError } from '../errors/not-authorized-error';

// NOTE: Expects to be placed after `currentUser` in the middleware statck!
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  if(!req.currentUser) {
    throw new NotAuthorizedError();
  }

  next();
}
