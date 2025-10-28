import { Regex } from 'package/Regex';
import { Option } from 'package/Option';

export class PokemonParser {
  private static readonly mixOperationExpression = /(\w+)\s*\+\s*(\w+)/gm;
  public static readonly inputMixOperationExpression = /(\w+)\s*\+\s*(\w+)/;

  public static parseMixOperation(mixOperation: string): Option<string[]> {
    return Option.some(
      Regex.matchAll(PokemonParser.mixOperationExpression, mixOperation)
    )
      .should(m => m.length === 1)
      .use(m => m[0].slice(1, m[0].length))
      .should(pokemonNames => pokemonNames.length === 2);
  }
}
