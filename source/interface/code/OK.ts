import { Output } from 'application/usecase/io/Output';

export class OK<T = void> {
  constructor(public readonly output: Output<T>) {}

  public get successCode() {
    return 200;
  }
}
