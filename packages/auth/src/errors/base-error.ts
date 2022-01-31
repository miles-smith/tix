export abstract class BaseError extends Error {
  abstract httpStatus: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, BaseError.prototype);
  }

  abstract serialize(): { message: string, field?: string; }[]
}
