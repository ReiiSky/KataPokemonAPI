import { LogValue } from 'package/log/LogValue';

export interface LogGroup {
  fatal(): LogValue;
  error(): LogValue;
  trace(): LogValue;
  info(): LogValue;
}
