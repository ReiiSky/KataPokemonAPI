import { LogCollector } from 'package/log/LogCollector';
import { ConsoleLoggerConfig } from 'package/log/ConsoleLoggerConfig';
import { LogLevelColor } from 'package/log/LogLevelColor';

export class ConsoleLogger extends LogCollector {
  constructor(private readonly config: ConsoleLoggerConfig) {
    super();
  }

  public async close(): Promise<void> {
    const summarized = this.summarize();
    const marshaled = this.config.pretty
      ? JSON.stringify(summarized, null, 2)
      : JSON.stringify(summarized);

    if (this.config.colorize) {
      await process.stdout.write(
        [
          LogLevelColor[summarized.level.toUpperCase()],
          marshaled,
          LogLevelColor.RESET,
        ].join('')
      );
    } else {
      await process.stdout.write(marshaled);
    }

    await process.stdout.write('\n');
  }
}
