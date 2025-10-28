import { EventWithResult } from 'domain/context/EventWithResult';
import { IEvent } from 'domain/context/IEvent';
import { Entity } from 'domain/entity/Entity';
import { Option } from 'package/Option';

export abstract class Aggregate<
  ET extends number | string = number,
  T extends Entity<ET> = Entity<ET>,
> {
  private readonly _events: EventWithResult[];
  private idSerial = 1;

  constructor(protected readonly root: T) {
    this._events = [];
  }

  protected addEvent(event: IEvent) {
    this._events.push(new EventWithResult(this.idSerial++, event));
  }

  public get events(): EventWithResult[] {
    return this._events;
  }

  public get lastEvent() {
    return Option.some(this._events[this._events.length - 1]);
  }

  public queryEvents(eventname: string) {
    const results: EventWithResult[] = [];

    for (const current of this._events) {
      if (current.child.eventname === eventname) {
        results.push(current);
      }
    }

    return results;
  }

  public containEvent(eventname: string) {
    return this._events.some(e => e.child.eventname === eventname);
  }

  public get id() {
    return this.root.id;
  }

  public get changelog() {
    return this.root.changelog.clone();
  }
}
