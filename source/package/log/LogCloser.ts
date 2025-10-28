export interface LogCloser {
  close(): Promise<void>;
}
