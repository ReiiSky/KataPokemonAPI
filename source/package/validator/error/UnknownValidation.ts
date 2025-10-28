import { AppError } from 'package/AppError';
import { Option } from 'package/Option';

export class UnknownValidation extends AppError {
  public constructor(value: object, errorValidation: object) {
    super(
      UnknownValidation.name,
      'unknown validation error.',
      Option.none(),
      Option.some({
        value,
        error: errorValidation,
      })
    );
  }
}
