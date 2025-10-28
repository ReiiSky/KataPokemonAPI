import { Request } from 'application/Request';
import { RequestFile } from 'application/RequestFile';
import { Unknown } from 'application/error/Unknown';
import { Output } from 'application/usecase/io/Output';
import { Context } from 'infrastructure/Context';
import joi from 'joi';
import { AppError } from 'package/AppError';
import { Option } from 'package/Option';
import { ExtendedRequest } from 'application/ExtendedRequest';

export abstract class BaseController<
  T,
  TOutput = void,
  TError extends AppError = AppError,
> {
  public async handle(
    req: Request<T> & ExtendedRequest
  ): Promise<Output<TOutput, TError>> {
    try {
      const params = this.validateParam(req.params);
      const headers = this.validateHeaders(req.headers);
      const query = this.validateQuery(req.query);
      const validInput = this.validate(req.payload.yolo());
      const validFiles = this.validateFiles(req.files);

      const outputData = await this.innerHandler(req.ctx, {
        ...req,
        params: params,
        headers,
        query: query,
        files: validFiles,
        payload: Option.some(validInput),
      });

      const output: Output<TOutput, TError> = {
        data: Option.some(outputData),
        meta: Option.none(),
        error: Option.none(),
      };

      return output;
    } catch (error) {
      const output: Output<TOutput, TError> = {
        data: Option.none(),
        meta: Option.none(),
        error:
          error instanceof AppError
            ? Option.some(error)
            : error instanceof Error
              ? Option.some(new Unknown(error.stack))
              : Option.some(new Unknown(error)),
      };

      return output;
    }
  }

  protected validateFiles(_: RequestFile[]): RequestFile[] {
    return [];
  }

  protected validateQuery(query: Record<string, string>) {
    return query;
  }

  protected validateHeaders(headers: Record<string, string>) {
    return headers;
  }

  protected validateParam(param: Record<string, string>) {
    return param;
  }

  protected abstract validate(input: unknown): T;
  protected abstract innerHandler(
    ctx: Context,
    req: Request<T>
  ): Promise<TOutput>;

  protected assetFileValidation(allowedKeys: string[]) {
    return joi
      .array()
      .items(
        joi.object({
          key: joi
            .string()
            .valid(...allowedKeys)
            .required(),
          mime: joi
            .object({
              type: joi
                .string()
                .valid(
                  'application/octet-stream',
                  'image/jpeg',
                  'image/png',
                  'video/mp4',
                  'video/mpeg',
                  'video/3gpp'
                )
                .required(),
              extension: joi.string().alphanum().max(8).required(),
            })
            .required(),
          data: joi.binary().required(),
        })
      )
      .options({
        abortEarly: true,
        cache: true,
      });
  }

  protected get otpCodeValidation() {
    return joi
      .string()
      .pattern(/^[0-9]{4}$/)
      .optional()
      .empty('')
      .default(null);
  }

  protected get passwordValidation() {
    return joi.string().min(1).max(32).required();
  }

  protected get emailValidation() {
    return joi.string().email().min(1).lowercase().required();
  }

  protected get sessionFieldsValidationRequired() {
    return {
      deviceID: joi.string().max(256).required(),
      deviceType: joi.string().valid('WEB', 'ANDROID', 'IOS').required(),
      firebaseToken: joi.string().max(256).required(),
      appVersion: joi.string().max(8).required(),
      advertisingID: joi.string().max(256).required(),
      language: this.languageValidation,
    };
  }

  protected get sessionFieldsValidationOptional() {
    return {
      deviceID: joi.string().max(256),
      deviceType: joi.string().valid('WEB', 'ANDROID', 'IOS').empty(''),
      firebaseToken: joi.string().max(256).empty(''),
      appVersion: joi.string().max(8).empty(''),
      advertisingID: joi.string().max(256).empty(''),
    };
  }

  protected get sessionValidation() {
    return joi.object(this.sessionFieldsValidationRequired).optional();
  }

  protected get languageValidation() {
    return joi.string().valid('en', 'id', 'my').empty('');
  }
}
