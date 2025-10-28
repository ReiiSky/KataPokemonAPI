import { ConnectionManager } from 'infrastructure/ConnectionManager';
import { IContextControl } from 'infrastructure/IContextControl';
import { IService } from 'infrastructure/IService';
import { RepositoriesRegistrator } from 'infrastructure/RepositoriesRegistrator';
import { LogGroup } from 'package/log/LogGroup';

export type ContextInstance = {
  readonly repositoryRegistrator: RepositoriesRegistrator;
  readonly logGroup: LogGroup;
  readonly lazyInitConnectionManager: (
    ctx: IContextControl
  ) => ConnectionManager;
  readonly lazyInitService: (ctx: IContextControl) => IService;
};
