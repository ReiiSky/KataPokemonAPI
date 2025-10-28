import { BaseError } from 'interface/BaseError';

export class Conflict extends BaseError {
  public get code(): number {
    return 409;
  }
}
