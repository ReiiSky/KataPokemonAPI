import joi from 'joi';
import { BaseController } from 'application/BaseController';
import { InvalidValue } from 'package/validator/error/InvalidValue';
import { Context } from 'infrastructure/Context';
import { Request } from 'application/Request';
import { JoiAdapter } from 'package/validator/JoiAdapter';
import { GetPokemonInformationInput } from 'application/usecase/io/GetPokemonInformationInput';
import { GetPokemonInformationOutput } from 'application/usecase/io/GetPokemonInformationOutput';
import { GetPokemonInformationUsecase } from 'application/usecase/GetPokemonInformationUsecase';

export class GetPokemonInformationController extends BaseController<
  GetPokemonInformationInput,
  GetPokemonInformationOutput,
  // TODO: Register all possible error in this controller.
  InvalidValue
> {
  private readonly usecase = new GetPokemonInformationUsecase();
  private readonly schema: joi.Schema;

  constructor() {
    super();

    this.schema = joi
      .object({
        pokemonName: joi.string().alphanum().required(),
      })
      .options({
        cache: true,
        abortEarly: true,
      })
      .required();
  }

  protected async innerHandler(
    ctx: Context,
    req: Request<GetPokemonInformationInput>
  ) {
    return await this.usecase.execute(ctx, req);
  }

  protected validate(input: unknown): GetPokemonInformationInput {
    const validInput = JoiAdapter.should<GetPokemonInformationInput>(
      this.schema,
      input
    );

    return validInput;
  }
}
