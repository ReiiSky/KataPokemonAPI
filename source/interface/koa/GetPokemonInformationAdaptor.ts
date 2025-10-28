import { BaseKoaAdapter } from 'interface/koa/BaseKoaAdapter';
import { Request } from 'application/Request';
import { ExtendedRequest } from 'application/ExtendedRequest';
import { GetPokemonInformationInput } from 'application/usecase/io/GetPokemonInformationInput';
import { GetPokemonInformationController } from 'application/controller/GetPokemonInformationController';
import { OK } from 'interface/code/OK';

export class GetPokemonInformationAdaptor extends BaseKoaAdapter<GetPokemonInformationInput> {
  constructor(private readonly controller: GetPokemonInformationController) {
    super();
  }

  protected async runHandler(
    req: Request<GetPokemonInformationInput> & ExtendedRequest
  ) {
    const output = await this.controller.handle(req);

    return new OK(output);
  }

  public get route(): string {
    return '/pokemon/information';
  }

  public get method() {
    return 'POST';
  }
}
