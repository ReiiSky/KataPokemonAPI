import { PokemonType } from 'application/usecase/io/PokemonType';
import { PokemonStat } from 'application/usecase/io/PokemonStat';
import { PokemonAbility } from 'application/usecase/io/PokemonAbility';

export type Pokemon = {
  id: number;
  name: string;
  imageURL: string;
  height: number;
  weight: number;
  types: PokemonType[];
  stats: PokemonStat[];
  abilities: PokemonAbility[];
};
