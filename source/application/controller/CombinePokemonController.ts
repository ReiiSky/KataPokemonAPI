import joi from 'joi';
import { BaseController } from 'application/BaseController';
import { InvalidValue } from 'package/validator/error/InvalidValue';
import { Context } from 'infrastructure/Context';
import { Request } from 'application/Request';
import { JoiAdapter } from 'package/validator/JoiAdapter';
import { CombinePokemonInput } from 'application/usecase/io/CombinePokemonInput';
import { CombinePokemonUsecase } from 'application/usecase/CombinePokemonUsecase';
import { CombinePokemonOutput } from 'application/usecase/io/CombinePokemonOutput';
import { PokemonParser } from 'package/PokemonParser';

export class CombinePokemonController extends BaseController<
  CombinePokemonInput,
  CombinePokemonOutput,
  InvalidValue
> {
  private readonly usecase = new CombinePokemonUsecase();
  private readonly schema: joi.Schema;

  constructor() {
    super();

    this.schema = joi
      .object({
        mixOperation: joi
          .string()
          .regex(PokemonParser.inputMixOperationExpression)
          .required(),
      })
      .options({
        cache: true,
        abortEarly: true,
      })
      .required();
  }

  protected async innerHandler(
    ctx: Context,
    req: Request<CombinePokemonInput>
  ) {
    return await this.usecase.execute(ctx, req);
  }

  protected validate(input: unknown): CombinePokemonInput {
    const validInput = JoiAdapter.should<CombinePokemonInput>(
      this.schema,
      input
    );

    return validInput;
  }
}
