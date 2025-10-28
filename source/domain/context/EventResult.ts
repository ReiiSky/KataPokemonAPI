import { Identifier } from 'domain/object/Identifier';

export type EventResult = {
  insertedIDs: Identifier<number>[];
  updatedCount: number;
};
