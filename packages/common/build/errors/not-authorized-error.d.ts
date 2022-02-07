import { BaseError } from './base-error';
export declare class NotAuthorizedError extends BaseError {
    httpStatus: number;
    constructor(message?: string);
    serialize(): {
        message: string;
    }[];
}
