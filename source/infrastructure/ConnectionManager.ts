import { NotImplemented } from 'infrastructure/error/NotImplemented';
import { Connection } from 'infrastructure/connection/Connection';
import { Techies } from 'infrastructure/connection/Techies';

export class ConnectionManager {
  private connectionMap: Map<string, Connection>;

  public constructor(private readonly connections: Connection[]) {
    this.connectionMap = new Map();

    for (const conn of this.connections) {
      this.connectionMap.set(conn.techies, conn);
    }
  }

  public async get(techies: Techies): Promise<Connection> {
    const conn = this.connectionMap.get(techies);

    if (!conn) {
      throw new NotImplemented(`${techies} connection`);
    }

    await conn.connect();

    return conn;
  }

  public async abortAll() {
    await this.doConnectionsAction(con => con.abort());
  }

  public async commitAll() {
    await this.doConnectionsAction(con => con.commit());
  }

  public async closeAll() {
    await this.doConnectionsAction(con => con.close());
  }

  public async pingAll() {
    await this.doConnectionsAction(con => con.ping());
  }

  private async doConnectionsAction(fn: (con: Connection) => Promise<void>) {
    const promises = this.connections.map(fn);
    await Promise.all(promises);
  }
}
