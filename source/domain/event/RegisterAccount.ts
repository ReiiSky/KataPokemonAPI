import { Credential } from 'domain/entity/Credential';

export class RegisterAccount {
  constructor(public readonly account: Credential) {}

  public get eventname() {
    return RegisterAccount.name;
  }
}
