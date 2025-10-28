import { LogValue } from 'package/log/LogValue';
import { LogLevel } from 'package/log//LogLevel';

export class LogLV {
  public readonly lv: Record<string, number | string | object>;

  constructor(public readonly level: LogLevel) {
    this.lv = {};
  }

  public number(label: string, content: number): LogValue {
    this.lv[label] = content;

    return this;
  }

  public string(label: string, content: string): LogValue {
    this.lv[label] = content;

    return this;
  }

  public object(label: string, content: object): LogValue {
    this.lv[label] = content;

    return this;
  }
}
