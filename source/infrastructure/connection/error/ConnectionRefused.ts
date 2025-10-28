import { AppError } from 'package/AppError';
import { Techies } from 'infrastructure/connection/Techies';
import { PostgresConfig } from 'infrastructure/connection/PostgresConfig';
import { Option } from 'package/Option';

export class ConnectionRefused extends AppError {
  constructor(
    techies: Techies,
    message: string,
    config: Option<PostgresConfig> = Option.none()
  ) {
    const configString = config
      .use(c => JSON.stringify(c))
      .use(cs => `, and config ${cs}.`)
      .unwrap('.');

    super(
      ConnectionRefused.name,
      `Error connection ${techies} refused, with message: ${message}${configString}`
    );
  }
}
