import { ValidationError } from 'express-validator';
import { BaseError } from './base-error';
export declare class RequestValidationError extends BaseError {
    private errors;
    httpStatus: number;
    constructor(errors: ValidationError[]);
    serialize(): {
        message: any;
        field: string;
    }[];
}
