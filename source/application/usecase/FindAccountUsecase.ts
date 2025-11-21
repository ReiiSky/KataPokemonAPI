import { Request } from 'application/Request';
import { Context } from 'infrastructure/Context';
import { FindAccountInput } from 'application/usecase/io/FindAccountInput';
import { GetByPhoneNumber } from 'domain/specification/GetByPhoneNumber';
import { FindAccountOutput } from 'application/usecase/io/FindAccountOutput';
import { NotFound } from 'package/error/NotFound';

export class FindAccountUsecase {
  public async execute(
    ctx: Context,
    req: Request<FindAccountInput>
  ): Promise<FindAccountOutput> {
    const payload = req.payload.yolo();
    const accountAggr = await ctx
      .repositories()
      .Account.getOne(new GetByPhoneNumber(payload.phoneNumber));

    if (accountAggr.isNone) {
      throw new NotFound('account');
    }

    const account = accountAggr.yolo();

    return {
      name: account.name,
    };
  }
}
