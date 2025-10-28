import { FileMime } from 'package/FileMime';

export type RequestFile = {
  key: string;
  mime: FileMime;
  data: Buffer;
};
