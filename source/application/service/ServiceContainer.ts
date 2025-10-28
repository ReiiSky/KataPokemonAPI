import { ServiceConfig } from 'application/service/ServiceConfig';
import { IContextControl } from 'infrastructure/IContextControl';
import { Services } from 'application/service/Services';

export class ServiceContainer {
  constructor(private readonly config: ServiceConfig) {}

  public build(ctx: IContextControl) {
    return new Services(ctx, this.config);
  }
}
