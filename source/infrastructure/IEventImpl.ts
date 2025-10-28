import { EventWithResult } from 'domain/context/EventWithResult';
import { IEvent } from 'domain/context/IEvent';
import { ConnectionManager } from './ConnectionManager';

export interface IEventImpl extends IEvent {
  // Execute function won't return any event result, because it's handled inside event handler.
  execute(manager: ConnectionManager, event: EventWithResult): Promise<void>;
}
