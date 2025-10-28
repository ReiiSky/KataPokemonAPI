import { AppError } from 'package/AppError';

export class InvalidSignature extends AppError {
  constructor(signature: string) {
    super(InvalidSignature.name, `Signature: ${signature}, is invalid.`);
  }
}
