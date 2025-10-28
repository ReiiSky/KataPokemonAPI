import { AppError } from 'package/AppError';

export interface IContextControl {
  try<T>(
    func: () => Promise<T>,
    errorFn: (error: Error) => AppError
  ): Promise<T>;
  dryRuns<T>(
    func: () => Promise<T>[]
  ): Promise<PromiseSettledResult<Awaited<T>>[]>;
}
