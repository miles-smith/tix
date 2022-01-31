import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface UserToken {
  id: string;
  email: string;
}

// Augment the base Express `Request` interface to optional expect a `currentUser` property that
// implements the `UserToken` interface.
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserToken;
    }
  }
}

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
  if(!req.session?.jwt) {
    return next();
  }

  try {
    const token = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserToken;
    req.currentUser = token;
  } catch (error) {

  }

  next();
};
