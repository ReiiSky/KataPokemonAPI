import { Option } from 'package/Option';
import { ConnectionManagerBuilder } from 'infrastructure/ConnectionManagerBuilder';
import { RepositoriesRegistrator } from 'infrastructure/RepositoriesRegistrator';
import { ServiceContainer } from 'application/service/ServiceContainer';
import { Logger } from 'package/log/Logger';

export type KernelInstance = {
  readonly repositoryRegistrator: RepositoriesRegistrator;
  readonly connectionBuilder: ConnectionManagerBuilder;
  readonly timeoutMSPerContext: Option<number>;
  readonly services: ServiceContainer;
  readonly logger: Logger;
};
