import { AcceptableMimeTypes } from 'application/AcceptableMimeTypes';
import { RequestFile } from 'application/RequestFile';
import { Context } from 'infrastructure/Context';
import { Generator } from 'package/Generator';

export class BaseUploadUsecase {
  protected async uploadImage(ctx: Context, f: RequestFile) {
    const filename = `${Generator.generateUID()}.${f.mime.extension}`;
    const putResult = await ctx.service().storage.put(f.data, {
      mimetype: f.mime.type as AcceptableMimeTypes,
      filename: filename,
    });

    return putResult;
  }
}
