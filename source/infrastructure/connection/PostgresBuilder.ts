import { Context } from 'infrastructure/Context';
import { PostgresConnection } from 'infrastructure/connection/PostgresConnection';

export class PostgresBuilder {
  public build(ctx: Context) {
    return new PostgresConnection(ctx);
  }
}
