import { AppError } from 'package/AppError';
import { Techies } from 'infrastructure/connection/Techies';

export class TransactionFailed extends AppError {
  constructor(techies: Techies, message: string) {
    super(
      TransactionFailed.name,
      `Error transaction ${techies} failed because of: ${message}.`
    );
  }
}
