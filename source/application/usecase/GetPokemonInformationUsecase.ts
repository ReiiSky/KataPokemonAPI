import { Request } from 'application/Request';
import { Context } from 'infrastructure/Context';
import { GetPokemonInformationInput } from 'application/usecase/io/GetPokemonInformationInput';
import { GetPokemonInformationOutput } from 'application/usecase/io/GetPokemonInformationOutput';
import { StringConverter } from 'package/StringConverter';

export class GetPokemonInformationUsecase {
  public async execute(
    ctx: Context,
    req: Request<GetPokemonInformationInput>
  ): Promise<GetPokemonInformationOutput> {
    const payload = req.payload.yolo();
    const pokemonOpt = await ctx
      .service()
      .pokeapi.findByName(payload.pokemonName);

    return pokemonOpt
      .use(p => ({
        ...p,
        name: StringConverter.toExternal(p.name),
        stats: p.stats.map(s => ({
          ...s,
          stat: {
            name: StringConverter.toExternal(s.stat.name),
          },
        })),
      }))
      .use(p => ({
        imageURL: p.imageURL,
        information: [
          `Berikut adalah informasi terkait pokemon ${p.name}.`,
          `Dengan berat ${p.weight / 10} KG dan tinggi ${p.height * 10} CM, ${p.name} menggunakan elemen: ${p.types
            .slice(0, 3)
            .map(t => StringConverter.toExternal(t.type.name))
            .join(', ')}.`,
          `Statistik ${p.stats.map(s => `${s.stat.name}: ${s.base_stat}`).join(', ')}.`,
          `Kemampuannya adalah sebagai berikut: ${p.abilities.map(a => StringConverter.toExternal(a.ability.name)).join(', ')}.`,
          'Berikut adalah gambarnya:',
        ].join('\n'),
      }))
      .yolo();
  }
}
