import { AppError } from 'package/AppError';

export class NotValidScope extends AppError {
  constructor() {
    super(NotValidScope.name, 'specification scope is not valid or empty.');
  }
}
