import { BaseError } from 'interface/BaseError';
import { InternalServerError } from 'interface/code/InternalServerError';
import { Option } from 'package/Option';
import { AppError } from 'package/AppError';

export class ErrorMapper {
  private errorMap: Record<string, BaseError>;
  private static internalServerError = new InternalServerError();

  public add(errorName: string, mappedError: BaseError): ErrorMapper {
    const newErrorMap: Record<string, BaseError> = {
      ...this.errorMap,
      [errorName]: mappedError,
    };

    const newMap = new ErrorMapper();
    newMap.errorMap = newErrorMap;

    return newMap;
  }

  public map(error: Option<AppError>) {
    return error
      .use(e => this.errorMap[e.code])
      .unwrap(ErrorMapper.internalServerError);
  }
}
