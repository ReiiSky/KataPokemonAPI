import { BaseError } from 'interface/BaseError';

export class BadRequest extends BaseError {
  public get code(): number {
    return 400;
  }
}
