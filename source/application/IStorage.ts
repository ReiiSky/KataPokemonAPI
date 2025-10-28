import { StorageResult } from 'application/StorageResult';
import { StorageOptions } from 'application/StorageOptions';

export interface IStorage {
  put(buffer: Buffer, options: StorageOptions): Promise<StorageResult>;
}
