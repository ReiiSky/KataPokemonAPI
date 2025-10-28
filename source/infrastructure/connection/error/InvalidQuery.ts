import { AppError } from 'package/AppError';

export class InvalidQuery extends AppError {
  constructor(error: Error) {
    super(InvalidQuery.name, `Query error with message: ${error.message}`);
  }
}
