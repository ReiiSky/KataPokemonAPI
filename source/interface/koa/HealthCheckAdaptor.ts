import { BaseKoaAdapter } from 'interface/koa/BaseKoaAdapter';
import { HealthCheckController } from 'application/controller/HealthCheckController';
import { OK } from 'interface/code/OK';
import { Request } from 'application/Request';
import { ExtendedRequest } from 'application/ExtendedRequest';

export class HealthCheckAdaptor extends BaseKoaAdapter<{}> {
  constructor(private readonly controller: HealthCheckController) {
    super();
  }

  protected async runHandler(req: Request<{}> & ExtendedRequest) {
    const output = await this.controller.handle(req);
    return new OK(output);
  }

  public get route(): string {
    return '/health';
  }

  public get method() {
    return 'GET';
  }
}
