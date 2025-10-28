import { KoaResponseMeta } from 'interface/KoaResponseMeta';
import { AppError } from 'package/AppError';
import { Option } from 'package/Option';

export type Output<T, TError extends AppError = AppError> = {
  meta: Option<{
    pagging: Option<KoaResponseMeta['pagging']>;
  }>;
  data: Option<T>;
  error: Option<AppError | TError>;
};
