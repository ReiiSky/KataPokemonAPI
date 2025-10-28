import { Aggregate } from 'domain/context/Aggregate';
import { Credential } from 'domain/entity/Credential';
import { Identifier } from 'domain/object/Identifier';
import { RegisterAccount } from 'domain/event/RegisterAccount';

export class Account extends Aggregate<number, Credential> {
  public register(name: string) {
    this.addEvent(
      new RegisterAccount(
        new Credential(Identifier.newNone(), {
          name: name,
        })
      )
    );
  }
}
