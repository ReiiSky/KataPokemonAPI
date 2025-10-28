import { BaseController } from 'application/BaseController';
import { InvalidValue } from 'package/validator/error/InvalidValue';
import { Context } from 'infrastructure/Context';
import { Request } from 'application/Request';
import joi from 'joi';
import { JoiAdapter } from 'package/validator/JoiAdapter';
import { BaseAuthenticationUsecase } from 'application/usecase/BaseAuthenticationUsecase';

export class AuthenticationController<T> extends BaseController<
  {},
  T,
  InvalidValue
> {
  private readonly authenticationHeadersSchema: joi.Schema;

  constructor(private readonly usecase: BaseAuthenticationUsecase<T>) {
    super();

    this.authenticationHeadersSchema = joi
      .object({
        authorization: joi.string().max(1024).min(32),
      })
      .options({
        allowUnknown: true,
        cache: true,
        abortEarly: true,
      });
  }

  protected async innerHandler(ctx: Context, req: Request<{}, {}>) {
    return await this.usecase.execute(ctx, req);
  }

  protected validateHeaders(
    headers: Record<string, string>
  ): Record<string, string> {
    return JoiAdapter.should(this.authenticationHeadersSchema, headers);
  }

  protected validate(_: unknown): {} {
    return null;
  }
}
