import { Aggregate } from 'domain/context/Aggregate';
import { Credential } from 'domain/entity/Credential';
import { Identifier } from 'domain/object/Identifier';
import { RegisterAccount } from 'domain/event/RegisterAccount';
import { UnexpectedValue } from 'package/error/UnexpectedValue';
import { ResetAccount } from 'domain/event/ResetAccount';

export class Account extends Aggregate<number, Credential> {
  public register(name: string, phoneNumber: string) {
    this.addEvent(
      new RegisterAccount(
        new Credential(Identifier.newNone(), {
          name,
          phoneNumber,
        })
      )
    );
  }

  public reset() {
    if (this.id.isNone) {
      throw new UnexpectedValue('identifier', 'none');
    }

    this.addEvent(new ResetAccount(this.id));
  }

  public get name() {
    return this.root.name;
  }
}
