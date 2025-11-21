import { Account } from 'domain/Account';
import { Aggregate } from 'domain/context/Aggregate';
import { ISpecification } from 'domain/context/ISpecification';
import { Credential } from 'domain/entity/Credential';
import { Identifier } from 'domain/object/Identifier';
import { GetByPhoneNumber } from 'domain/specification/GetByPhoneNumber';
import { PostgresConnection } from 'infrastructure/connection/PostgresConnection';
import { Techies } from 'infrastructure/connection/Techies';
import { IConnectionManager } from 'infrastructure/IConnectionManager';
import { QueryOptions } from 'infrastructure/QueryOptions';

export class PGAccountGetByPhoneNumber {
  async query(
    manager: IConnectionManager,
    specification: ISpecification,
    _: QueryOptions
  ): Promise<Aggregate[]> {
    const spec = specification as GetByPhoneNumber;
    const conn = await manager.get(Techies.Postgres);

    const prismaConn = conn as PostgresConnection;
    const accountRow = await prismaConn.applyCtx(
      prismaConn.C.users.findFirst({
        where: {
          deleted: false,
          phoneNumber: spec.phoneNumber,
        },
      })
    );

    if (!accountRow) {
      return [];
    }

    const accountAggr = new Account(
      new Credential(Identifier.new(accountRow.id), {
        name: accountRow.name,
        phoneNumber: accountRow.phoneNumber,
      })
    );

    return [accountAggr];
  }

  get specname() {
    return GetByPhoneNumber.name;
  }
}
