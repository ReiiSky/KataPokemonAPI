import { Config } from 'package/Config';

export abstract class VarConfig {
  static load() {
    return new Config(process.env);
  }
}
