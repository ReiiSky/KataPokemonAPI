import { RequestFile } from 'application/RequestFile';
import { Option } from 'package/Option';

export type Request<T, TAuthorization = {}> = {
  query: Record<string, string>;
  params: Record<string, string>;
  authorization: Option<{
    content: TAuthorization;
  }>;
  headers: Record<string, string>;
  payload: Option<T>;
  files: RequestFile[];
};
