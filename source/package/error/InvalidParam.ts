import { AppError } from 'package/AppError';
import { Option } from 'package/Option';

export class InvalidParam extends AppError {
  constructor(paramname: string, on = Option.none<string>()) {
    super(
      InvalidParam.name,
      `invalid parameter '${paramname}'${on.use(name => ` on ${name}`).unwrap('')}.`
    );
  }
}
