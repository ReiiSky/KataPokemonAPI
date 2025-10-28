import { Request } from 'application/Request';
import { Context } from 'infrastructure/Context';
import { CombinePokemonInput } from 'application/usecase/io/CombinePokemonInput';
import { CombinePokemonOutput } from 'application/usecase/io/CombinePokemonOutput';
import { PokemonParser } from 'package/PokemonParser';
import { UnknownMixOperation } from 'application/error/UnkownMixOperation';
import { UnexpectedValue } from 'package/error/UnexpectedValue';
import { AcceptableMimeTypes } from 'application/AcceptableMimeTypes';

export class CombinePokemonUsecase {
  public async execute(
    ctx: Context,
    req: Request<CombinePokemonInput>
  ): Promise<CombinePokemonOutput> {
    const payload = req.payload.yolo();
    const pokemonNamesOpt = PokemonParser.parseMixOperation(
      payload.mixOperation
    );

    if (pokemonNamesOpt.isNone) {
      throw new UnknownMixOperation(payload.mixOperation);
    }

    const pokemonNames = pokemonNamesOpt.yolo();

    const first = pokemonNames[0];
    const isFirstExist = await this.isPokemonExist(ctx, first);

    if (!isFirstExist) {
      return {
        imageURL: null,
        notFound: first,
      };
    }

    const second = pokemonNames[1];
    const isSecondExist = await this.isPokemonExist(ctx, second);

    if (!isSecondExist) {
      return {
        imageURL: null,
        notFound: second,
      };
    }

    const generatedOpt = await ctx
      .service()
      .openrouter.generateImage(
        `combined of two pokemon: ${first} and ${second}`
      );

    if (generatedOpt.isNone) {
      throw new UnexpectedValue('generated mix operation', 'none');
    }

    const generated = generatedOpt.yolo();
    const storageResult = await ctx.service().storage.put(generated.buffer, {
      filename: `${first}-${second}.${Date.now()}.${generated.mimeType.extension}`,
      mimetype: generated.mimeType.type as unknown as AcceptableMimeTypes,
    });

    return {
      imageURL: storageResult.url,
      notFound: null,
    };
  }

  public async isPokemonExist(
    ctx: Context,
    pokemonName: string
  ): Promise<boolean> {
    const pokemonOpt = await ctx.service().pokeapi.findByName(pokemonName);
    return !pokemonOpt.isNone;
  }
}
