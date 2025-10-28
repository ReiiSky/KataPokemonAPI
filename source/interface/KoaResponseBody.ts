import { KoaResponseMeta } from 'interface/KoaResponseMeta';
import { AppErrorObject } from 'package/AppErrorObject';

export type KoaResponseBody = {
  status: 'success' | 'failed';
  meta: Partial<KoaResponseMeta>;
  data?: unknown;
  error?: AppErrorObject;
};
