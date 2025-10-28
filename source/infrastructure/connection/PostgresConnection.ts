import { PrismaClient } from '@prisma/client';
import { PrismaPromise, Sql } from '@prisma/client/runtime/library';
import { EventResult } from 'domain/context/EventResult';
import { EventWithResult } from 'domain/context/EventWithResult';
import { Identifier } from 'domain/object/Identifier';
import { IContextControl } from 'infrastructure/IContextControl';
import { Connection } from 'infrastructure/connection/Connection';
import { PostgresConfig } from 'infrastructure/connection/PostgresConfig';
import { Techies } from 'infrastructure/connection/Techies';
import { TransactionFailed } from 'infrastructure/connection/error/TransactionFailed';
import { Option } from 'package/Option';
import { InvalidParam } from 'package/error';

export class PostgresConnection extends Connection {
  private static client = PostgresConnection.initializeClient();
  private static _config: PostgresConfig;
  private isConnected = false;

  // biome-ignore lint/suspicious/noExplicitAny: unknown return
  private operations: (() => PrismaPromise<any>)[] = [];
  private eventResults: EventWithResult[] = [];
  // biome-ignore lint/suspicious/noExplicitAny: unknown prisma result data
  private preprocessResultFn: Option<(result: any) => any>[] = [];

  constructor(ctx: IContextControl) {
    super(ctx, Techies.Postgres);

    if (PostgresConnection.client) {
      return;
    }

    PostgresConnection.client = PostgresConnection.initializeClient();
  }

  public get C() {
    return PostgresConnection.client;
  }

  public static patchConfigOnce(config: PostgresConfig) {
    if (PostgresConnection._config) {
      throw new InvalidParam(
        'should do only once',
        Option.some('Postgres patch config')
      );
    }

    PostgresConnection._config = config;
  }

  private static get config() {
    if (!PostgresConnection._config) {
      throw new InvalidParam(
        'postgres config',
        Option.some('Postgres get config')
      );
    }

    return PostgresConnection._config;
  }

  private static initializeClient() {
    try {
      const config = PostgresConnection.config;
      const query = [
        Option.some(config.options.connectionLimit)
          .should(limit => limit > 0)
          .use(limit => `connection_limit=${limit}`)
          .unwrap(''),
        Option.some(config.options.pgbouncer)
          .should(pgbouncer => pgbouncer)
          .use(_ => 'pgbouncer=true')
          .unwrap(''),
      ]
        .filter(q => q.length > 0)
        .join('&');

      return new PrismaClient({
        datasourceUrl: `postgresql://${config.user}:${config.pass}@${config.host}:${config.port}/${config.db}?${query}`,
      });
    } catch (_) {
      _;
    }
  }

  public connect(): Promise<void> {
    this.tryThrowAborted();

    if (this.isConnected) {
      return;
    }

    // INFO: Disable because don't need to manually create connection
    // await this.ctx.try(
    //   () => this.C.$connect(),
    //   error => this.errConnectionRefused(error, 'CONNECT')
    // );

    this.isConnected = true;
  }

  public async close(): Promise<void> {
    // INFO: Disable because don't need to manually disconnect connection
    // await this.ctx.try(
    //   () => this.client.$disconnect(),
    //   error => this.errConnectionRefused(error, 'DISCONNECT')
    // );
  }

  public async commit(): Promise<void> {
    this.tryThrowAborted();

    await this.ctx.try(
      async () => {
        const results = await PostgresConnection.client.$transaction(
          this.operations.map(op => op())
        );
        // TODO: assume there have 3 event with # of ops: A (2), B (1), and C (4).
        // the order of results would be
        // A A B C C C C. after this order, the map result sould recognize
        // IDX: 5 should in event result C, 3 should be in B, etc.
        this.eventResults.forEach((eventResult, idx) =>
          // this feature is not work properly
          // what if one event impl have more than one op().
          // in current design, one event impl can only support one operations result,
          // and will be putted in order.
          // the solution is to using id, and put id to operation where operation belongs
          // to some event. but what if saving more than one aggregates?
          // every aggregate have their own id in order, so some id would be duplicated
          // the solution is to override increment and order of id in every aggregates passed to
          // saving method in Repositories.ts add function reorderEventGlobalID(...aggregates)
          eventResult.putResult(
            this.mapPrismaResult(
              this.preprocessResultFn[idx].lazyUnwrap(() => result => result)(
                results[idx]
              )
            )
          )
        );
      },
      error => new TransactionFailed(this.techies, error?.message)
    );

    this.resetTransaction();
  }

  private resetTransaction() {
    this.operations = [];
    this.eventResults = [];
    this.preprocessResultFn = [];
  }

  /**
   * @param result
   * biome-ignore lint/suspicious/noExplicitAny: passed from prisma any value
   */
  private mapPrismaResult(returned: any): Option<EventResult> {
    if (!returned) {
      return Option.none();
    }

    const result: EventResult = {
      insertedIDs: [],
      updatedCount: 0,
    };

    if (typeof returned.id === 'number' || typeof returned.id === 'bigint') {
      result.insertedIDs.push(Identifier.new(Number(returned.id)));
    }

    return Option.some(result);
  }

  public abort(): Promise<void> {
    this.tryThrowAborted();
    this.aborted = true;

    return Promise.resolve();
  }

  public addOperation(
    // TODO: use Option<EventWithResult> instead, because no all operation
    // needs to store in event result.
    result: EventWithResult,
    // biome-ignore lint/suspicious/noExplicitAny: unknown prisma promise type
    operationFunc: () => PrismaPromise<any>,
    // biome-ignore lint/suspicious/noExplicitAny: dynamic type of preprocess value
    preprocessFn = Option.none<(result: any) => any>()
  ) {
    this.tryThrowAborted();
    this.operations.push(operationFunc);
    this.eventResults.push(result);
    this.preprocessResultFn.push(preprocessFn);
  }

  public async ping() {
    await this.ctx.try(
      () => PostgresConnection.client.$queryRaw(new Sql(['select 1'], [])),
      error =>
        this.errConnectionRefused(error, 'PING', PostgresConnection._config)
    );
  }
}
