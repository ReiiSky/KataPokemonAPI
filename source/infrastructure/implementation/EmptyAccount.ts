import { Account } from 'domain/Account';
import { Aggregate } from 'domain/context/Aggregate';
import { Credential } from 'domain/entity/Credential';
import { Identifier } from 'domain/object/Identifier';
import { Empty } from 'domain/specification/Empty';

export class EmptyAccount {
  query(): Promise<Aggregate[]> {
    const accountAggr = new Account(
      new Credential(Identifier.newNone(), {
        name: 'test',
      })
    );

    return Promise.resolve([accountAggr]);
  }

  get specname() {
    return Empty.name;
  }
}
