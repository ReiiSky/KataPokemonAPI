import { EventWithResult } from 'domain/context/EventWithResult';
import { RegisterAccount } from 'domain/event/RegisterAccount';
import { ConnectionManager } from 'infrastructure/ConnectionManager';
import { PostgresConnection } from 'infrastructure/connection/PostgresConnection';
import { Techies } from 'infrastructure/connection/Techies';

export class PGRegisterAccount {
  async execute(
    manager: ConnectionManager,
    eventResult: EventWithResult
  ): Promise<void> {
    const conn = await manager.get(Techies.Postgres);
    const prismaConn = conn as PostgresConnection;
    const event = eventResult.child as RegisterAccount;

    prismaConn.addOperation(eventResult, () =>
      prismaConn.C.users.create({
        data: {
          name: event.account.name,
        },
        select: {
          id: true,
        },
      })
    );
  }

  get eventname() {
    return RegisterAccount.name;
  }
}
