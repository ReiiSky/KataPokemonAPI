import { Request } from 'application/Request';
import { Context } from 'infrastructure/Context';
import { Authenticator } from 'interface/Authenticator';

export abstract class BaseAuthenticationUsecase<T> {
  constructor(private readonly authenticator: Authenticator<T>) {}

  protected parse(req: Request<{}, {}>): T {
    const headers = req.headers;
    const authToken = headers.authorization;
    const content = this.authenticator.verify(authToken);

    return content;
  }

  public abstract execute(ctx: Context, req: Request<{}, {}>): Promise<T>;
}
