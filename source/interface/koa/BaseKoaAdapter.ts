import { Request } from 'application/Request';
import { RequestFile } from 'application/RequestFile';
import { InvalidFlow } from 'package/error/InvalidFlow';
import { NotFound as NotFoundApplication } from 'package/error/NotFound';
import { InvalidAuthentication } from 'application/service/error/InvalidAuthentication';
import { NotImplemented } from 'infrastructure/error';
import { ErrorMapper } from 'interface/ErrorMapper';
import { Response } from 'interface/Response';
import { BadRequest } from 'interface/code/BadRequest';
import { InternalServerError } from 'interface/code/InternalServerError';
import { NotFound } from 'interface/code/NotFound';
import { Unauthorized } from 'interface/code/Unauthorized';
import { InternalServerErrorResponse } from 'interface/koa/InternalServerErrorResponse';
import { KoaFile } from 'interface/koa/KoaFile';
import Koa from 'koa';
import { Files } from 'package/Files';
import { Option } from 'package/Option';
import { InvalidParam, Timeout } from 'package/error';
import { UnexpectedValue } from 'package/error/UnexpectedValue';
import { InvalidValue } from 'package/validator/error/InvalidValue';
import { Output } from 'application/usecase/io/Output';
import { BaseError } from 'interface/BaseError';
import { LogLabel } from 'package/log/LogLabel';
import { Kernel } from 'infrastructure/Kernel';
import { LogGroup } from 'package/log/LogGroup';
import { LogCloser } from 'package/log/LogCloser';
import { ExtendedRequest } from 'application/ExtendedRequest';
import { AuthenticationController } from 'application/controller/AuthenticationController';

export abstract class BaseKoaAdapter<TPayload, TAuthorization = {}> {
  protected errors: ErrorMapper;

  constructor(
    private readonly authController = Option.none<
      AuthenticationController<TAuthorization>
    >()
  ) {
    const internalServerError = new InternalServerError();
    const badRequest = new BadRequest();
    const unauthorized = new Unauthorized();

    this.errors = new ErrorMapper()
      .add(NotImplemented.name, internalServerError)
      .add(Timeout.name, internalServerError)
      .add(InvalidValue.name, badRequest)
      .add(InvalidAuthentication.name, unauthorized)
      .add(UnexpectedValue.name, internalServerError)
      .add(InvalidParam.name, internalServerError)
      .add(InvalidFlow.name, badRequest)
      .add(NotFoundApplication.name, new NotFound());
  }

  public abstract get route(): string;
  public abstract get method(): string;
  protected abstract runHandler(
    req: Request<TPayload, TAuthorization>
  ): Promise<Response>;

  private internalServerErrorResponse() {
    return new InternalServerErrorResponse();
  }

  public async loadFiles(
    ctx: Koa.ParameterizedContext
  ): Promise<RequestFile[]> {
    const requestFiles = ctx.request.files;
    const fileKeys = Object.keys(requestFiles || {});

    if (fileKeys.length <= 0) {
      return [];
    }

    const files: RequestFile[] = fileKeys
      .map(key => ({
        key,
        file: requestFiles[key] as KoaFile,
      }))
      .filter(f => f.file?.filepath)
      .map(f => ({
        key: f.key,
        mime: {
          type: f.file.mimetype,
          extension: f.file.mimetype.split('/').slice(-1).join(''),
        },
        data: Files.loadFile(f.file.filepath),
      }));

    return files;
  }

  public parseQuery(ctx: Koa.ParameterizedContext) {
    return Option.some(ctx.request.query)
      .should(q => Object.keys(q).length > 0)
      .use(q =>
        Object.keys(q)
          .map(key => [key, Array.isArray(q[key]) ? q[key][0] : q[key]])
          .filter(([, value]) => !!value)
          .reduce(
            (aggr, [key, value]) => ({ ...aggr, [String(key)]: value }),
            {}
          )
      )
      .unwrap({});
  }

  public parseHeaders(ctx: Koa.ParameterizedContext) {
    const h = ctx.headers;

    return Option.some(h)
      .should(h => Object.keys(h).length > 0)
      .use(h =>
        Object.keys(h)
          .map(key => [key, Array.isArray(h[key]) ? h[key][0] : h[key]])
          .filter(([, value]) => !!value)
          .reduce(
            (aggr, [key, value]) => ({ ...aggr, [String(key)]: value }),
            {}
          )
      )
      .unwrap({}) as Record<string, string>;
  }

  public async adapt(ctx: Koa.ParameterizedContext) {
    const headers = this.parseHeaders(ctx);
    const query = this.parseQuery(ctx);
    const files = await this.loadFiles(ctx);
    const params = ctx.params;

    const kernelCtx = Kernel.instance().newContext();
    const lg = kernelCtx.log() as LogGroup & LogCloser;

    const koaRequest: Request<TPayload, TAuthorization> & ExtendedRequest = {
      params,
      headers,
      query,
      files,
      ctx: kernelCtx,
      authorization: Option.none<{ content: TAuthorization }>(),
      payload: Option.some(ctx.request.body as TPayload),
    };

    lg.info().object(LogLabel.Request, {
      method: ctx.request.method,
      path: ctx.request.URL.pathname,
      params,
      query,
      headers: ctx.request.headers,
      body: ctx.request.body,
      files: files.map(f => ({
        key: f.key,
        mime: f.mime,
        size: f.data.length,
      })),
    });

    try {
      if (!this.authController.isNone) {
        const authController = this.authController.yolo();

        const output = await authController.handle(
          koaRequest as Request<{}> & ExtendedRequest
        );

        const error = output.error;
        const data = output.data;

        if (!error.isNone) {
          this.handleErrorResponse(ctx, output, lg);
          return;
        }

        koaRequest.authorization = Option.some({
          content: data.yolo(),
        });
      }

      // add error status code converter
      const resp = await this.runHandler(koaRequest);
      const output = resp.output;

      if (!output.error.isNone) {
        this.handleErrorResponse(ctx, output, lg);
        return;
      }

      this.setResponseContext(ctx, resp.successCode, output);
      await this.printLog(lg, resp.successCode, output);
    } catch (error) {
      if (!(error instanceof InvalidAuthentication)) {
        return;
      }

      const code = new Unauthorized().code;
      const output: Output<object> = {
        meta: Option.some({
          pagging: Option.none(),
        }),
        data: Option.none<object>(),
        error: Option.some(error),
      };

      this.setResponseContext(ctx, code, output);
      await this.printLog(lg, code, output);
    } finally {
      await kernelCtx.close();
    }
  }

  private async handleErrorResponse(
    ctx: Koa.ParameterizedContext,
    output: Response['output'],
    lg: LogGroup & LogCloser
  ) {
    const error = this.errors.map(output.error);

    this.setResponseContext(ctx, error.code, output);
    await this.printLog(lg, error.code, output);
  }

  private isInternalError(e: BaseError) {
    return e instanceof InternalServerError;
  }

  private setResponseContext<T>(
    ctx: Koa.ParameterizedContext,
    statusCode: number,
    output: Output<T>
  ) {
    const mappedError = output.error.use(_ => this.errors.map(output.error));
    const mappedStatusCode = mappedError.use(e => e.code).unwrap(statusCode);

    const status = mappedStatusCode <= 399 ? 'success' : 'failed';
    const data = output.data.unwrap(null);

    const meta = output.meta
      .use(m => ({
        pagging: m.pagging.unwrap(null),
      }))
      .unwrap(null);

    const error = mappedError
      .use(e =>
        this.isInternalError(e)
          ? this.internalServerErrorResponse().toObject
          : output.error.use(e => e.toObject).yolo()
      )
      .yolo();

    ctx.status = mappedStatusCode;

    ctx.body = {
      status,
      meta,
      data,
      error,
    };
  }

  private async printLog<T>(
    lg: LogGroup & LogCloser,
    statusCode: number,
    output: Output<T>
  ): Promise<void> {
    const mappedError = output.error.use(_ => this.errors.map(output.error));
    const mappedStatusCode = mappedError.use(e => e.code).unwrap(statusCode);

    const status = mappedStatusCode <= 399 ? 'success' : 'failed';
    const data = output.data.yolo();

    const meta = output.meta
      .use(m => ({
        pagging: m.pagging.yolo(),
      }))
      .yolo();

    const isInternal = mappedError
      .use(e => this.isInternalError(e))
      .unwrap(false);

    const error = output.error.use(e => e.toObject).yolo();

    const response = {
      code: mappedStatusCode,
      status,
      meta,
      data,
      error: {
        internal: isInternal,
        ...(error ? error : {}),
      },
    };

    if (status === 'success') {
      lg.info().object(LogLabel.Response, response);
    } else if (status === 'failed' && !isInternal) {
      lg.error().object(LogLabel.Response, response);
    } else {
      lg.fatal().object(LogLabel.Response, response);
    }

    await lg.close();
  }
}
