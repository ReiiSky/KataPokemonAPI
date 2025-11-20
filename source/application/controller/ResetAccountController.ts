import joi from 'joi';
import { BaseController } from 'application/BaseController';
import { InvalidValue } from 'package/validator/error/InvalidValue';
import { Context } from 'infrastructure/Context';
import { Request } from 'application/Request';
import { JoiAdapter } from 'package/validator/JoiAdapter';
import { ResetAccountInput } from 'application/usecase/io/ResetAccountInput';
import { ResetAccountUsecase } from 'application/usecase/ResetAccountUsecase';

export class ResetAccountController extends BaseController<
  ResetAccountInput,
  void,
  // TODO: Register all possible error in this controller.
  InvalidValue
> {
  private readonly usecase = new ResetAccountUsecase();
  private readonly resetSchema: joi.Schema;

  constructor() {
    super();

    this.resetSchema = joi
      .object({
        phoneNumber: joi
          .string()
          .regex(/[0-9]{8,16}/)
          .required(),
      })
      .options({
        cache: true,
        abortEarly: true,
      })
      .required();
  }

  protected async innerHandler(ctx: Context, req: Request<ResetAccountInput>) {
    await this.usecase.execute(ctx, req);
  }

  protected validate(input: unknown): ResetAccountInput {
    const validInput = JoiAdapter.should<ResetAccountInput>(
      this.resetSchema,
      input
    );

    return validInput;
  }
}
