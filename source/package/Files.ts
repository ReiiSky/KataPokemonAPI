import { readFileSync } from 'node:fs';

export class Files {
  public static loadFile(path: string) {
    const buffer = readFileSync(path);

    return buffer;
  }
}
