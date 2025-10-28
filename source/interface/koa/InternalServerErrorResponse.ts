import { AppError } from 'package/AppError';

export class InternalServerErrorResponse extends AppError {
  constructor() {
    super(InternalServerErrorResponse.name, 'internal server error');
  }
}
