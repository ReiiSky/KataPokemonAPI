import { IContextControl } from 'infrastructure/IContextControl';
import { ExternalRequest } from 'infrastructure/error/ExternalRequest';
import { Option } from 'package/Option';
import { OpenRouterGenerateImageResult } from 'application/service/OpenRouterGenerateImageResult';

export class OpenRouter {
  private static readonly OPENROUTER_BASE_URL =
    'https://openrouter.ai/api/v1/chat/completions';
  private static readonly IMAGE_GENERATION_MODEL =
    'google/gemini-2.5-flash-image-preview';

  constructor(
    private readonly ctx: IContextControl,
    private readonly openrouterAPISecret: string
  ) {}

  public async generateImage(
    prompt: string
  ): Promise<Option<OpenRouterGenerateImageResult>> {
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${this.openrouterAPISecret}`);
    headers.set('Content-Type', 'application/json');

    const response = await this.ctx.try(
      () =>
        fetch(OpenRouter.OPENROUTER_BASE_URL, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: OpenRouter.IMAGE_GENERATION_MODEL,
            messages: [
              {
                role: 'user',
                content: prompt,
              },
            ],
            modalities: ['image'],
          }),
        }),
      error => new ExternalRequest(error, OpenRouter.name)
    );

    const body = await response.json();
    const bufferString = Option.some(body)
      .should(b => b.choices.length > 0)
      .should(b => b.choices[0].message.images.length > 0)
      .use(b => b.choices[0].message.images[0].image_url.url as string);

    const bufferOpt = bufferString
      .use(url => url.split(',')[1])
      .use(base64 => Buffer.from(base64, 'base64'));

    const fileMime = bufferString
      .use(url => url.split(',')[0])
      .use(url => url.split(';')[0].replace('data:', ''))
      .use(url => ({
        type: url.split(';')[0].replace('data:', ''),
        extension: url.split(';')[0].replace('data:', '').split('/')[1],
      }));

    if (bufferOpt.isNone) {
      return Option.none();
    }

    return Option.some({
      buffer: bufferOpt.yolo(),
      mimeType: fileMime.yolo(),
    });
  }
}
