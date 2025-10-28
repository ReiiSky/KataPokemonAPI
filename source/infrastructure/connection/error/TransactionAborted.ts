import { AppError } from 'package/AppError';
import { Techies } from 'infrastructure/connection/Techies';

export class TransactionAborted extends AppError {
  constructor(techies: Techies) {
    super(TransactionAborted.name, `Error transaction ${techies} aborted.`);
  }
}
