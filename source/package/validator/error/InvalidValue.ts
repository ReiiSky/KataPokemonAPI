import { AppError } from 'package/AppError';
import { Option } from 'package/Option';

export class InvalidValue extends AppError {
  public constructor(
    fieldname: string,
    invalidMessage: string,
    actualValue = Option.none<unknown>()
  ) {
    super(
      InvalidValue.name,
      invalidMessage,
      Option.none(),
      Option.some({
        fieldname,
        actualValue: actualValue.yolo(),
      })
    );
  }
}
