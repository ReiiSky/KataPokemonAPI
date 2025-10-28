import { AppError } from 'package/AppError';
import { Option } from 'package/Option';

export class ExternalRequest extends AppError {
  constructor(error: Error, scope: string) {
    super(
      ExternalRequest.name,
      `Error external request in scope: ${scope}, error: ${error.message}`
    );
  }

  static newWithResponse(
    scope: string,
    statusCode: number,
    body = Option.none<unknown>()
  ) {
    return new ExternalRequest(
      new Error(
        `statusCode: ${statusCode}, body: ${body.use(JSON.stringify).yolo()}`
      ),
      scope
    );
  }
}
