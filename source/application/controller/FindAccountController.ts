import joi from 'joi';
import { BaseController } from 'application/BaseController';
import { InvalidValue } from 'package/validator/error/InvalidValue';
import { Context } from 'infrastructure/Context';
import { Request } from 'application/Request';
import { JoiAdapter } from 'package/validator/JoiAdapter';
import { FindAccountInput } from 'application/usecase/io/FindAccountInput';
import { FindAccountUsecase } from 'application/usecase/FindAccountUsecase';
import { FindAccountOutput } from 'application/usecase/io/FindAccountOutput';

export class FindAccountController extends BaseController<
  FindAccountInput,
  FindAccountOutput,
  // TODO: Register all possible error in this controller.
  InvalidValue
> {
  private readonly usecase = new FindAccountUsecase();
  private readonly FindSchema: joi.Schema;

  constructor() {
    super();

    this.FindSchema = joi
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

  protected async innerHandler(ctx: Context, req: Request<FindAccountInput>) {
    return await this.usecase.execute(ctx, req);
  }

  protected validate(input: unknown): FindAccountInput {
    const validInput = JoiAdapter.should<FindAccountInput>(
      this.FindSchema,
      input
    );

    return validInput;
  }
}
