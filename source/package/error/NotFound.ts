import { AppError } from 'package/AppError';

export class NotFound extends AppError {
  constructor(dataname: string) {
    super(NotFound.name, `${dataname} not found.`);
  }
}
