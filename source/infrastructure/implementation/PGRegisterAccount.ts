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
      prismaConn.C.users.upsert({
        create: {
          name: event.account.name,
          phoneNumber: event.account.phoneNumber,
          deleted: false,
        },
        update: {
          name: event.account.name,
          phoneNumber: event.account.phoneNumber,
          deleted: false,
        },
        where: {
          phoneNumber: event.account.phoneNumber,
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
