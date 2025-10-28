import { Aggregate } from 'domain/context/Aggregate';
import { Entity } from 'domain/entity/Entity';

export type AggregateAllType = Aggregate<
  number | string,
  Entity<number | string>
>;
