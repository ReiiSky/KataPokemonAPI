import { Schema, ValidationErrorItem } from 'joi';
import { Option } from 'package/Option';
import { InvalidValue } from 'package/validator/error/InvalidValue';

export abstract class JoiAdapter {
  private static extractContext<T>(
    item: Option<ValidationErrorItem>,
    fieldname: string
  ) {
    return item.use<T>(detail =>
      Option.some(detail.context)
        .use(context =>
          JoiAdapter.newSafeDetail(
            context.details as ValidationErrorItem[]
          ).yolo()
        )
        .use(context => context[fieldname])
        .unwrap(detail[fieldname])
    );
  }

  private static newSafeDetail(items: ValidationErrorItem[]) {
    return Option.some(items)
      .should(details => details.length > 0)
      .use(details => details[details.length - 1]);
  }

  public static should<TReturn>(
    schema: Schema<number>,
    value: unknown,
    customFieldName = Option.none<string>()
  ): TReturn {
    const { error, value: validValue } = schema.validate(value, {
      abortEarly: true,
      cache: true,
    });

    if (error) {
      const errDetails = error.details;

      const rootSafeDetail = JoiAdapter.newSafeDetail(errDetails);
      const safePath = customFieldName.unwrap(
        JoiAdapter.extractContext<(string | number)[]>(rootSafeDetail, 'path')
          .use(path => path.map(p => p.toString()).join('.'))
          .unwrap('#unknown')
      );

      const safeMessage = JoiAdapter.extractContext<string>(
        rootSafeDetail,
        'message'
      )
        .use(message =>
          customFieldName
            .use(name => message.replace('"value"', `"${name}"`))
            .unwrap(message)
        )
        .yolo();

      throw new InvalidValue(safePath, safeMessage, Option.some(value));
    }

    return validValue;
  }
}
