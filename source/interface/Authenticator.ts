export interface Authenticator<T> {
  verify(token: string): T;
}
