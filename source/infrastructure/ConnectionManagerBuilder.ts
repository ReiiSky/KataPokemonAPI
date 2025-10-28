import { ConnectionManager } from './ConnectionManager';
import { IContextControl } from './IContextControl';
import { IConnectionBuilder } from './connection/IConnectionBuilder';

export class ConnectionManagerBuilder {
  constructor(private readonly connectionBuilders: IConnectionBuilder[] = []) {}

  public add(connectionBuilder: IConnectionBuilder) {
    this.connectionBuilders.push(connectionBuilder);

    return this;
  }

  public build(ctx: IContextControl): ConnectionManager {
    const connections = this.connectionBuilders.map(builder =>
      builder.build(ctx)
    );
    return new ConnectionManager(connections);
  }
}
