export interface Authorizer<T> {
  generate(payload: T): { secret: string; refresh: string };
  regenerate(refresh: string): string;
  parse(secret: string): T;
  oldParse(secret: string): T;
}
