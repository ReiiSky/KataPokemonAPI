import { AppError } from 'package/AppError';

export class InvalidConfig extends AppError {
  public constructor(key: string, value: string) {
    super(
      InvalidConfig.name,
      `invalid get config '${key}' with value: '${value}'`
    );
  }
}
