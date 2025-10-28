import { IStorage } from 'application/IStorage';
import { PokeAPI } from 'application/service/PokeAPI';

export interface IService {
  storage: IStorage;
  pokeapi: PokeAPI;
}
