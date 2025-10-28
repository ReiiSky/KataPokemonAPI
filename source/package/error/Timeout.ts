import { AppError } from 'package/AppError';

export class Timeout extends AppError {
  constructor() {
    super(Timeout.name, 'Timeout error occured');
  }
}
