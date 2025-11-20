import { Request } from 'application/Request';
import { Context } from 'infrastructure/Context';
import { ResetAccountInput } from 'application/usecase/io/ResetAccountInput';
import { GetByPhoneNumber } from 'domain/specification/GetByPhoneNumber';

export class ResetAccountUsecase {
  public async execute(
    ctx: Context,
    req: Request<ResetAccountInput>
  ): Promise<void> {
    const payload = req.payload.yolo();
    const accountAggr = await ctx
      .repositories()
      .Account.getOne(new GetByPhoneNumber(payload.phoneNumber));

    if (accountAggr.isNone) {
      return;
    }

    const account = accountAggr.yolo();

    account.reset();

    await ctx.repositories().save(account);
  }
}
