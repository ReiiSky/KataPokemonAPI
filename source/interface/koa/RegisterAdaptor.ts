import { BaseKoaAdapter } from 'interface/koa/BaseKoaAdapter';
import { Request } from 'application/Request';
import { ExtendedRequest } from 'application/ExtendedRequest';
import { RegisterInput } from 'application/usecase/io/RegisterInput';
import { RegisterAccountController } from 'application/controller/RegisterAccountController';
import { Created } from 'interface/code/Created';

export class RegisterAdaptor extends BaseKoaAdapter<RegisterInput> {
  constructor(private readonly controller: RegisterAccountController) {
    super();
  }

  protected async runHandler(req: Request<RegisterInput> & ExtendedRequest) {
    const output = await this.controller.handle(req);

    return new Created(output);
  }

  public get route(): string {
    return '/account';
  }

  public get method() {
    return 'POST';
  }
}
