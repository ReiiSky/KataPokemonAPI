import { IStorage } from 'application/IStorage';
import { S3 } from 'application/service/S3';
import { ServiceConfig } from 'application/service/ServiceConfig';
import { IContextControl } from 'infrastructure/IContextControl';

export class Services {
  private _storage: IStorage;

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
}
