import { Option } from 'package/Option';
import { EventResult } from 'domain/context/EventResult';
import { IEvent } from 'domain/context/IEvent';

export class EventWithResult {
  constructor(
    public readonly id: number,
    public readonly child: IEvent,
    private _result = Option.none<EventResult>()
  ) {}

  public putResult(result: Option<EventResult>) {
    this._result = result;
  }

  public get result() {
    return this._result;
  }
}
