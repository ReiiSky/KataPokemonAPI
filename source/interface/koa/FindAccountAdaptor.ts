import { BaseKoaAdapter } from 'interface/koa/BaseKoaAdapter';
import { Request } from 'application/Request';
import { ExtendedRequest } from 'application/ExtendedRequest';
import { FindAccountInput } from 'application/usecase/io/FindAccountInput';
import { FindAccountController } from 'application/controller/FindAccountController';
import { OK } from 'interface/code/OK';

export class FindAccountAdaptor extends BaseKoaAdapter<FindAccountInput> {
  constructor(private readonly controller: FindAccountController) {
    super();
  }

  protected async runHandler(
    req: Request<FindAccountInput> & ExtendedRequest
  ) {
    const output = await this.controller.handle(req);

    return new OK(output);
  }

  public get route(): string {
    return '/account/find';
  }

  public get method() {
    return 'POST';
  }
}
