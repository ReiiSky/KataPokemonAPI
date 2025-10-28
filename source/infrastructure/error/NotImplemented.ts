import { AppError } from 'package/AppError';

export class NotImplemented extends AppError {
  constructor(notImplementedFeatureName: string) {
    super(
      NotImplemented.name,
      `${notImplementedFeatureName} is not implemented`
    );
  }
}
