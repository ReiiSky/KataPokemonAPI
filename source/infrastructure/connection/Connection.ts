import { ConnectionRefused } from 'infrastructure/connection/error/ConnectionRefused';
import { TransactionAborted } from 'infrastructure/connection/error/TransactionAborted';
import { Techies } from 'infrastructure/connection/Techies';
import { Option } from 'package/Option';
import { PostgresConfig } from 'infrastructure/connection/PostgresConfig';
import { IContextControl } from 'infrastructure/IContextControl';
import { InvalidQuery } from 'infrastructure/connection/error/InvalidQuery';

export abstract class Connection {
  constructor(
    protected readonly ctx: IContextControl,
    public readonly techies: Techies,
    protected aborted = false
  ) {}

  abstract connect(): Promise<void>;
  abstract abort(): Promise<void>;
  abstract commit(): Promise<void>;
  abstract close(): Promise<void>;
  abstract ping(): Promise<void>;

  protected tryThrowAborted() {
    if (!this.aborted) {
      return;
    }

    throw new TransactionAborted(this.techies);
  }

  public async applyCtx<T>(promise: Promise<T>): Promise<T> {
    return this.ctx.try(
      () => promise,
      error => new InvalidQuery(error)
    );
  }

  protected errConnectionRefused(
    error: Error,
    prefix: string,
    config: PostgresConfig
  ) {
    return new ConnectionRefused(
      this.techies,
      `${prefix} ${error?.message}`,
      Option.some(config)
    );
  }
}
