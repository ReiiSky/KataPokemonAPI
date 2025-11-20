import { EventWithResult } from 'domain/context/EventWithResult';
import { ResetAccount } from 'domain/event/ResetAccount';
import { ConnectionManager } from 'infrastructure/ConnectionManager';
import { PostgresConnection } from 'infrastructure/connection/PostgresConnection';
import { Techies } from 'infrastructure/connection/Techies';

export class PGResetAccount {
  async execute(
    manager: ConnectionManager,
    eventResult: EventWithResult
  ): Promise<void> {
    const conn = await manager.get(Techies.Postgres);
    const prismaConn = conn as PostgresConnection;
    const event = eventResult.child as ResetAccount;

    prismaConn.addOperation(eventResult, () =>
      prismaConn.C.users.update({
        data: {
          deleted: true,
        },
        where: {
          id: event.accountIdentifier.value,
        },
        select: {
          id: true,
        },
      })
    );
  }

  get eventname() {
    return ResetAccount.name;
  }
}
