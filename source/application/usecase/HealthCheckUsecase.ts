import { Context } from 'infrastructure/Context';

export class HealthCheckUsecase {
  public async execute(ctx: Context): Promise<void> {
    await ctx.repositories().ping();
  }
}
