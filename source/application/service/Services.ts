import { IStorage } from 'application/IStorage';
import { S3 } from 'application/service/S3';
import { ServiceConfig } from 'application/service/ServiceConfig';
import { IContextControl } from 'infrastructure/IContextControl';
import { PokeAPI } from 'application/service/PokeAPI';
import { OpenRouter } from 'application/service/OpenRouter';

export class Services {
  private _storage: IStorage;
  private _pokeapi: PokeAPI;
  private _openrouter: OpenRouter;

  constructor(
    private ctx: IContextControl,
    private config: ServiceConfig
  ) {}

  public get storage() {
    if (this._storage) {
      return this._storage;
    }

    this._storage = new S3(this.ctx, this.config.s3);

    return this._storage;
  }

  public get pokeapi() {
    if (this._pokeapi) {
      return this._pokeapi;
    }

    this._pokeapi = new PokeAPI(this.ctx);

    return this._pokeapi;
  }

  public get openrouter() {
    if (this._openrouter) {
      return this._openrouter;
    }

    this._openrouter = new OpenRouter(
      this.ctx,
      this.config.openrouterAPISecret
    );

    return this._openrouter;
  }
}
