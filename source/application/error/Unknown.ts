import { AppError } from 'package/AppError';

export class Unknown extends AppError {
  // biome-ignore lint/suspicious/noExplicitAny: unknown type of value error.
  constructor(innerError: any) {
    super(
      Unknown.name,
      `unmapped error with data '${innerError?.toString() || innerError}'`
    );
  }
}
