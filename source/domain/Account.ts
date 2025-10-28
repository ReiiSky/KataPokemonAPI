import { Aggregate } from 'domain/context/Aggregate';
import { Credential } from 'domain/entity/Credential';

export class Account extends Aggregate<number, Credential> {}
