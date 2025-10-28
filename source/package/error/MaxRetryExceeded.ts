import { AppError } from 'package/AppError';

export class MaxRetryExceeded extends AppError {
  constructor() {
    super(MaxRetryExceeded.name, 'Task retrt count is exceeded');
  }
}
