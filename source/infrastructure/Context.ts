import { ConnectionManager } from 'infrastructure/ConnectionManager';
import { ContextInstance } from 'infrastructure/ContextInstance';
import { IService } from 'infrastructure/IService';
import { Repositories } from 'infrastructure/Repositories';
import { RepositoriesRegistrator } from 'infrastructure/RepositoriesRegistrator';
import { AppError } from 'package/AppError';
import { Timer } from 'package/Timer';
import { Timeout } from 'package/error';
import { LogGroup } from 'package/log/LogGroup';

export class Context {
  private readonly timer: Timer;
  private readonly repositoryRegistrator: RepositoriesRegistrator;
  private readonly connectionManager: ConnectionManager;
  private readonly _service: IService;
  private readonly logGroup: LogGroup;

  constructor(timeoutms: number, instance: ContextInstance) {
    this.logGroup = instance.logGroup;
    this.timer = Timer.withTimeout(timeoutms);
    this._service = instance.lazyInitService(this);
    this.repositoryRegistrator = instance.repositoryRegistrator;
    this.connectionManager = instance.lazyInitConnectionManager(this);
  }

  // TODO: There is a possibility of using the try function,
  // even if the time has timed out.
  // Decide whether the recent function is still runnable if it happens
  // or if it should, the keep guard against the timeout error before the func running.
  // For example, the request may ultimately need to close the context,
  // but if the context has already timed out, it would throw an error in the
  // finally scope, where this scope has no catch mechanism.
  async try<T>(
    func: () => Promise<T>,
    errorFn: (error: Error) => AppError
  ): Promise<T> {
    try {
      return await this.timer.run(func());
    } catch (error) {
      if (error instanceof Timeout) {
        throw new Timeout();
      }

      const recognizedError =
        error instanceof Error ? error : new Error(JSON.stringify(error));

      throw errorFn(recognizedError);
    }
  }

  // INFO: ignore error
  public async dryRuns<T>(
    func: () => Promise<T>[]
  ): Promise<PromiseSettledResult<Awaited<T>>[]> {
    try {
      const results = await this.timer.settles(func());

      return results;

      // biome-ignore lint/suspicious/noEmptyBlockStatements: ignore error
    } catch (_) {}

    return [];
  }

  public repositories(): Repositories {
    return new Repositories(this.repositoryRegistrator, this.connectionManager);
  }

  public async close(): Promise<void> {
    this.timer.close();
    await this.connectionManager.closeAll();
  }

  public service(): IService {
    return this._service;
  }

  public log(): LogGroup {
    return this.logGroup;
  }
}
