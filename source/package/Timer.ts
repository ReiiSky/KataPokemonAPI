import { Timeout, InvalidParam } from './error';
import { Option } from 'package/Option';

export class Timer {
  private timeoutPromise: Promise<void>;
  private isTimeout = false;
  private isClosed = false;

  private constructor(ms: number) {
    this.timeoutPromise = new Promise((resolve, reject) =>
      setTimeout(() => {
        if (this.isClosed) {
          return resolve();
        }

        reject(new Timeout());
        this.isTimeout = true;
      }, ms)
    );
  }

  public static withTimeout(ms: number) {
    if (Number.isNaN(ms) || ms <= 0) {
      throw new InvalidParam('ms', Option.some(Timer.name));
    }

    return new Timer(ms);
  }

  public async run<T>(promise: Promise<T>): Promise<T> {
    if (this.isTimeout) {
      throw new Timeout();
    }

    const result = await Promise.race([this.timeoutPromise, promise]);
    return result as T;
  }

  public async settles<T>(
    promises: Promise<T>[]
  ): Promise<PromiseSettledResult<Awaited<T>>[]> {
    if (this.isTimeout) {
      throw new Timeout();
    }

    const returned = await Promise.race([
      Promise.allSettled(promises),
      this.timeoutPromise,
    ]);

    if (!(returned || Array.isArray(returned))) {
      return promises.map(_ => ({ status: 'rejected', reason: null }));
    }

    return returned;
  }

  public static async wait(ms: number) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  public close() {
    this.isClosed = true;
  }
}
