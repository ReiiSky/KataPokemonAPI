import { Entity } from 'domain/entity/Entity';
import { CredentialObject } from 'domain/object/CredentialObject';
import { Identifier } from 'domain/object/Identifier';

export class Credential extends Entity {
  constructor(
    identifer: Identifier,
    public readonly value: CredentialObject
  ) {
    super(identifer);
  }
}
