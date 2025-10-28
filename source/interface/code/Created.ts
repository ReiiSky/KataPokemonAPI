import { Output } from 'application/usecase/io/Output';

export class Created<T = void> {
  constructor(public readonly output: Output<T>) {}

  public get successCode() {
    return 201;
  }
}
