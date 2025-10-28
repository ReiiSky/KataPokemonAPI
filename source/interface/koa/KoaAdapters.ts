import Koa from 'koa';
import Router from 'koa-router';
import { koaBody } from 'koa-body';
import cors from '@koa/cors';
import { HTTPAdapterPayload } from 'interface/HTTPAdapterPayload';

export class KoaAdapters {
  private readonly instance: Koa<Koa.DefaultState, Koa.DefaultContext>;
  private readonly router = new Router();
  private isRouteInitialized = false;

  constructor(private readonly port: number) {
    const payloadLimitSize = 12 * 1024 * 1024;

    this.instance = new Koa();
    this.instance.use(cors());
    this.instance.use(
      koaBody({
        multipart: true,
        json: true,
        formLimit: payloadLimitSize,
        jsonLimit: payloadLimitSize,
        formidable: {
          maxTotalFileSize: payloadLimitSize,
        },
      })
    );
  }

  public add(handler: HTTPAdapterPayload<Koa.ParameterizedContext>) {
    this.router[handler.method.toLowerCase()](
      handler.route,
      async ctx => await handler.adapt(ctx)
    );

    return this;
  }

  private applyRoute() {
    if (this.isRouteInitialized) {
      return;
    }

    this.instance.use(this.router.routes()).use(this.router.allowedMethods());
    this.isRouteInitialized = true;
  }

  get callback() {
    this.applyRoute();
    return this.instance.callback();
  }

  public listen(onListen: (port: number) => void) {
    this.applyRoute();
    this.instance.listen(this.port, () => onListen(this.port));
  }
}
