import { Changelog } from 'domain/object/Changelog';
import type { Identifier } from 'domain/object/Identifier';

export abstract class Entity<T = number> {
  constructor(
    private readonly identifier: Identifier<T>,
    public readonly changelog = new Changelog()
  ) {}

  public get id(): Identifier<T> {
    return this.identifier.clone();
  }
}
