import { BaseError } from 'interface/BaseError';

export class PaymentRequired extends BaseError {
  public get code(): number {
    return 402;
  }
}
