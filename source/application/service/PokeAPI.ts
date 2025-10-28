import { Pokemon } from 'application/usecase/io/Pokemon';
import { ExternalRequest } from 'infrastructure/error/ExternalRequest';
import { IContextControl } from 'infrastructure/IContextControl';
import { Option } from 'package/Option';

export class PokeAPI {
  private static readonly BASE_URL = 'https://pokeapi.co/api/v2';
  private static readonly IMAGE_BASE_URL =
    'https://www.pokemon.com/static-assets/content-assets/cms2/img/pokedex/full';
  constructor(private readonly ctx: IContextControl) {}

  public async findByName(name: string): Promise<Option<Pokemon>> {
    const url = `${PokeAPI.BASE_URL}/pokemon/${name}`;

    const response = await this.ctx.try(
      () =>
        fetch(url, {
          method: 'GET',
        }),
      error => new ExternalRequest(error, PokeAPI.name)
    );

    if (response.status >= 300) {
      return Option.none();
    }

    try {
      const responseBody = await response.json();
      return Option.some(responseBody as Pokemon).use(p => ({
        ...p,
        imageURL: `${PokeAPI.IMAGE_BASE_URL}/${p.id.toString().padStart(3, '0')}.png`,
      }));
    } catch (_) {
      return Option.none();
    }
  }
}
