import { AppError } from 'package/AppError';

export class UnknownMixOperation extends AppError {
  constructor(op: string) {
    super(UnknownMixOperation.name, `operation: ${op} unknown`);
  }
}
