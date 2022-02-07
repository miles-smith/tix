import { BaseError } from './base-error';
export declare class BadRequestError extends BaseError {
    message: string;
    httpStatus: number;
    constructor(message?: string);
    serialize(): {
        message: string;
    }[];
}
