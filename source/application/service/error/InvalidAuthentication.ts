import { AppError } from 'package/AppError';

export class InvalidAuthentication extends AppError {
  constructor(reason: string) {
    super(
      InvalidAuthentication.name,
      `authentication failed due to '${reason}'`
    );
  }
}
