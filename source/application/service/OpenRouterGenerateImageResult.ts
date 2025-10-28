import { FileMime } from 'package/FileMime';

export type OpenRouterGenerateImageResult = {
  buffer: Buffer;
  mimeType: FileMime;
};
