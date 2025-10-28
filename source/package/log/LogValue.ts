export interface LogValue {
  number(label: string, content: number): LogValue;
  string(label: string, content: string): LogValue;
  object(label: string, content: object): LogValue;
}
