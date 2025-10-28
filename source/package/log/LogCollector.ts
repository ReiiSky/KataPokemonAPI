import { Option } from 'package/Option';
import { LogLV } from 'package/log/LogLV';
import { LogLevel } from 'package/log/LogLevel';

export abstract class LogCollector {
  private readonly startTime: Date;
  public readonly logs: LogLV[];

  constructor() {
    this.startTime = new Date();
    this.logs = [];
  }

  public fatal(): LogLV {
    const lv = new LogLV(LogLevel.FATAL);
    this.logs.push(lv);

    return lv;
  }

  public error(): LogLV {
    const lv = new LogLV(LogLevel.ERROR);
    this.logs.push(lv);

    return lv;
  }

  public trace(): LogLV {
    const lv = new LogLV(LogLevel.TRACE);
    this.logs.push(lv);

    return lv;
  }

  public info(): LogLV {
    const lv = new LogLV(LogLevel.INFO);
    this.logs.push(lv);

    return lv;
  }

  public extend(lc: LogCollector): LogCollector {
    this.logs.push(...lc.logs);

    return this;
  }

  public summarize() {
    const unixStart = this.startTime.getTime();

    return {
      time: unixStart,
      duration: new Date().getTime() - unixStart,
      level: Option.some(this.logs)
        .should(logs => logs.length > 0)
        .use(logs => logs[logs.length - 1])
        .use(log => log.level)
        .unwrap(LogLevel.INFO),
      logs: this.logs.map(log => ({ ...log.lv, level: log.level })),
    };
  }
}
