import { AppError } from 'package/AppError';

export class InvalidFlow extends AppError {
  constructor(currentFlow: string) {
    super(
      InvalidFlow.name,
      `Flow ${currentFlow} cannot continue because some required flows must occur before this.`
    );
  }
}
