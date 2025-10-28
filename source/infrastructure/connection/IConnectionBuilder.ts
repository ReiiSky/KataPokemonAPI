import { Connection } from 'infrastructure/connection/Connection';
import { IContextControl } from 'infrastructure/IContextControl';

export interface IConnectionBuilder {
  build(ctx: IContextControl): Connection;
}
