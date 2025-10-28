import { BaseController } from 'application/BaseController';
import { Context } from 'infrastructure/Context';
import { Request } from 'application/Request';
import { InvalidValue } from 'package/validator/error/InvalidValue';
import { HealthCheckUsecase } from 'application/usecase/HealthCheckUsecase';

export class HealthCheckController extends BaseController<
  {},
  void,
  InvalidValue
> {
  private readonly usecase = new HealthCheckUsecase();

  protected validate(_: unknown) {
    return {};
  }

  protected async innerHandler(ctx: Context, _: Request<{}>) {
    await this.usecase.execute(ctx);
  }
}
