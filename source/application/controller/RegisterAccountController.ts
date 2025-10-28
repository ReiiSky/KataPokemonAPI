import joi from 'joi';
import { BaseController } from 'application/BaseController';
import { InvalidValue } from 'package/validator/error/InvalidValue';
import { Context } from 'infrastructure/Context';
import { Request } from 'application/Request';
import { JoiAdapter } from 'package/validator/JoiAdapter';
import { RegisterInput } from 'application/usecase/io/RegisterInput';
import { RegisterUsecase } from 'application/usecase/RegisterUsecase';

export class RegisterAccountController extends BaseController<
  RegisterInput,
  void,
  // TODO: Register all possible error in this controller.
  InvalidValue
> {
  private readonly usecase = new RegisterUsecase();
  private readonly registerSchema: joi.Schema;

  constructor() {
    super();

    this.registerSchema = joi
      .object({
        name: joi.string().alphanum().required(),
      })
      .options({
        cache: true,
        abortEarly: true,
      })
      .required();
  }

  protected async innerHandler(ctx: Context, req: Request<RegisterInput>) {
    await this.usecase.execute(ctx, req);
  }

  protected validate(input: unknown): RegisterInput {
    const validInput = JoiAdapter.should<RegisterInput>(
      this.registerSchema,
      input
    );

    return validInput;
  }
}
