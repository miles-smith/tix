export declare abstract class BaseError extends Error {
    abstract httpStatus: number;
    constructor(message: string);
    abstract serialize(): {
        message: string;
        field?: string;
    }[];
}
