import { Option } from 'package/Option';
import { readFileSync } from 'node:fs';

export class Config {
  public constructor(
    private readonly KV: { [key: string]: string | undefined }
  ) {}

  public getString(key: string) {
    return Option.some(this.KV[key]);
  }

  public getNumber(key: string) {
    return Option.some(Number(this.KV[key])).use(value =>
      Number.isNaN(value) ? undefined : value
    );
  }

  public getObjectFromFile(
    path: string,
    options = { ignoreEmpty: true }
  ): Option<Record<string, string>> {
    try {
      const fileStream = readFileSync(path);

      return Option.some(JSON.parse(fileStream.toString()));
    } catch (error) {
      if (options.ignoreEmpty) {
        return Option.none();
      }

      throw error;
    }
  }
}
