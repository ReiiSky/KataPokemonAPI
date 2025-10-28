import { LogCloser } from 'package/log/LogCloser';
import { LogGroup } from 'package/log/LogGroup';

export class Logger {
  constructor(private readonly newGroupFn: () => LogGroup & LogCloser) {}

  public newGroup() {
    return this.newGroupFn();
  }
}
