import { BaseError } from 'interface/BaseError';

export class Unauthorized extends BaseError {
  public get code(): number {
    return 401;
  }
}
