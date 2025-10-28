import { BaseError } from 'interface/BaseError';

export class InternalServerError extends BaseError {
  public get code(): number {
    return 500;
  }
}
