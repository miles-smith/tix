import { Request, Response, NextFunction } from 'express';
interface UserToken {
    id: string;
    email: string;
}
declare global {
    namespace Express {
        interface Request {
            currentUser?: UserToken;
        }
    }
}
export declare const currentUser: (req: Request, res: Response, next: NextFunction) => void;
export {};
