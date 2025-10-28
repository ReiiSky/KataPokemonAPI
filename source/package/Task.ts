import { RetryOption } from 'package/RetryOption';
import { MaxRetryExceeded } from 'package/error/MaxRetryExceeded';
import { Timer } from 'package/Timer';

export abstract class Task {
  public static async retry<T>(
    opt: RetryOption,
    fn: () => T | Promise<T>
  ): Promise<T> {
    const wrappedFn = async (retryCount = 0) => {
      if (retryCount >= opt.maxRetries) {
        throw new MaxRetryExceeded();
      }

      try {
        return await fn();
      } catch (_) {
        await Timer.wait(opt.ms);
        return await wrappedFn(retryCount + 1);
      }
    };

    const results = await wrappedFn();

    return results;
  }
}
