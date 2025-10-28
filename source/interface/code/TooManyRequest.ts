import { BaseError } from 'interface/BaseError';

export class TooManyRequest extends BaseError {
  public get code(): number {
    return 429;
  }
}
