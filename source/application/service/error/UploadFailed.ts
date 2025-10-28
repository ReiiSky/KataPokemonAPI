import { AppError } from 'package/AppError';

export class UploadFailed extends AppError {
  constructor(reason: string) {
    super(UploadFailed.name, `upload failed due to: ${reason}`);
  }
}
