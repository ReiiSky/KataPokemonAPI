import {
  GetObjectCommand,
  ObjectCannedACL,
  PutObjectCommandInput,
  S3 as S3SDK,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { IContextControl } from 'infrastructure/IContextControl';
import { S3Config } from 'application/service/S3Config';
import { StorageOptions } from 'application/StorageOptions';
import { UploadFailed } from 'application/service/error/UploadFailed';
import { Option } from 'package/Option';

export class S3 {
  private readonly client: S3SDK;

  constructor(
    private readonly ctx: IContextControl,
    private readonly config: S3Config
  ) {
    this.client = new S3SDK({
      endpoint: Option.some(this.config.endpoint)
        .should(e => e.length > 0)
        .yolo(),
      credentials: {
        accessKeyId: this.config.accessKey,
        secretAccessKey: this.config.secretKey,
      },
      region: config.region,
    });
  }

  public async put(data: Buffer, options: StorageOptions) {
    const identifierPayload = {
      Bucket: this.config.bucket,
      Key: options.filename,
    };

    // TODO: use file hashing technique,
    // to prevent create multiple file.
    const payload = {
      Body: data,
      ContentType: options.mimetype as string,
      ACL: 'public-read' as ObjectCannedACL,
    };

    const cmdPayload: PutObjectCommandInput = {
      ...payload,
      ...identifierPayload,
    };

    const uploadPromise = this.client.putObject(cmdPayload);

    await this.ctx.try(
      () => uploadPromise,
      error => new UploadFailed(error.message)
    );

    const command = new GetObjectCommand(cmdPayload);
    const signedUrlPromise = getSignedUrl(this.client, command, {});

    const signedUrl = await this.ctx.try(
      () => signedUrlPromise,
      error => new UploadFailed(error.message)
    );

    const parsedURL = new URL(signedUrl);

    return {
      url: parsedURL.origin + parsedURL.pathname,
    };
  }
}
