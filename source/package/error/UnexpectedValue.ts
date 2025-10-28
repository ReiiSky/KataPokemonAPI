import { AppError } from 'package/AppError';

export class UnexpectedValue extends AppError {
  constructor(expectedType: string, actualType: string = null) {
    super(
      UnexpectedValue.name,
      `expected type: ${expectedType}, but got: ${actualType}`
    );
  }
}
