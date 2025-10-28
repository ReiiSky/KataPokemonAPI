import { Option } from 'package/Option';
import { StringConverter } from 'package/StringConverter';

export abstract class AppError extends Error {
  constructor(
    public readonly code: string,
    public readonly message: string,
    public readonly solution = Option.none<string>(),
    public readonly detail = Option.none<object>()
  ) {
    super(message);
  }

  get toObject() {
    return {
      code: StringConverter.fromExternal(this.code),
      message: this.message,
      solution: this.solution.yolo(),
      detail: this.detail.yolo(),
    };
  }
}
