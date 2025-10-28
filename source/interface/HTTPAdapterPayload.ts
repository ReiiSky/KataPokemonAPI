export interface HTTPAdapterPayload<T> {
  route: string;
  method: string; // 'POST' | 'GET' | 'PATCH' | 'PUT' | 'DEL'
  adapt: (payload: T) => Promise<void>;
}
