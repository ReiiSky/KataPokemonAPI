import { Request } from 'application/Request';
import { Context } from 'infrastructure/Context';
import { EmptyAccount } from 'infrastructure/implementation/EmptyAccount';
import { RegisterInput } from 'application/usecase/io/RegisterInput';

export class RegisterUsecase {
  public async execute(
    ctx: Context,
    req: Request<RegisterInput>
  ): Promise<void> {
    const accountAggr = await ctx
      .repositories()
      .Account.getOne(new EmptyAccount());

    const payload = req.payload.yolo();
    const account = accountAggr.yolo();

    account.register(payload.name);

    await ctx.repositories().save(account);
  }
}
