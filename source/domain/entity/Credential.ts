import { Entity } from 'domain/entity/Entity';
import { CredentialObject } from 'domain/object/CredentialObject';
import { Identifier } from 'domain/object/Identifier';

export class Credential extends Entity {
  constructor(
    identifer: Identifier,
    private readonly value: CredentialObject
  ) {
    super(identifer);
  }

  public get name() {
    return this.value.name;
  }
}
