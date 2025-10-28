import { Option } from 'package/Option';
import { AppTime } from 'domain/object/AppTime';

export class Changelog {
  constructor(
    private _createdAt = AppTime.now(),
    private _updatedAt = Option.none<AppTime>(),
    private _deletedAt = Option.none<AppTime>()
  ) {}

  public clone() {
    return new Changelog(this._createdAt, this._updatedAt, this._deletedAt);
  }

  public get createdAt() {
    return this._createdAt;
  }

  public get updatedAt() {
    return this._updatedAt;
  }

  public get deletedAt() {
    return this._deletedAt;
  }

  public update() {
    this._updatedAt = Option.some(AppTime.now());
  }
}
