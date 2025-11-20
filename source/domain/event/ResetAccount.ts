import { Identifier } from 'domain/object/Identifier';

export class ResetAccount {
  constructor(public readonly accountIdentifier: Identifier) {}

  public get eventname() {
    return ResetAccount.name;
  }
}
