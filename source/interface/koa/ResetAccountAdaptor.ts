import { BaseKoaAdapter } from 'interface/koa/BaseKoaAdapter';
import { Request } from 'application/Request';
import { ExtendedRequest } from 'application/ExtendedRequest';
import { ResetAccountInput } from 'application/usecase/io/ResetAccountInput';
import { ResetAccountController } from 'application/controller/ResetAccountController';
import { OK } from 'interface/code/OK';

export class ResetAccountAdaptor extends BaseKoaAdapter<ResetAccountInput> {
  constructor(private readonly controller: ResetAccountController) {
    super();
  }

  protected async runHandler(
    req: Request<ResetAccountInput> & ExtendedRequest
  ) {
    const output = await this.controller.handle(req);

    return new OK(output);
  }

  public get route(): string {
    return '/account/reset';
  }

  public get method() {
    return 'POST';
  }
}
