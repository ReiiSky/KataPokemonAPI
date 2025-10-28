import { BaseError } from 'interface/BaseError';

export class NotFound extends BaseError {
  public get code(): number {
    return 404;
  }
}
