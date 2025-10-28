import { BaseKoaAdapter } from 'interface/koa/BaseKoaAdapter';
import { Request } from 'application/Request';
import { ExtendedRequest } from 'application/ExtendedRequest';
import { CombinePokemonController } from 'application/controller/CombinePokemonController';
import { CombinePokemonInput } from 'application/usecase/io/CombinePokemonInput';
import { OK } from 'interface/code/OK';

export class CombinePokemonAdaptor extends BaseKoaAdapter<CombinePokemonInput> {
  constructor(private readonly controller: CombinePokemonController) {
    super();
  }

  protected async runHandler(
    req: Request<CombinePokemonInput> & ExtendedRequest
  ) {
    const output = await this.controller.handle(req);

    return new OK(output);
  }

  public get route(): string {
    return '/pokemon/mix';
  }

  public get method() {
    return 'POST';
  }
}
