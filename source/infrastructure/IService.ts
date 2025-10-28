import { IStorage } from 'application/IStorage';
import { OpenRouter } from 'application/service/OpenRouter';
import { PokeAPI } from 'application/service/PokeAPI';

export interface IService {
  storage: IStorage;
  pokeapi: PokeAPI;
  openrouter: OpenRouter;
}
