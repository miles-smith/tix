import { BaseError } from './base-error';
export declare class RoutingError extends BaseError {
    httpStatus: number;
    constructor(message?: string);
    serialize(): {
        message: string;
    }[];
}
