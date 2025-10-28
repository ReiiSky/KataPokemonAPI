import { AggregateAllType } from 'domain/context/AggregateAllType';
import { ISpecification } from 'domain/context/ISpecification';
import { IConnectionManager } from 'infrastructure/IConnectionManager';
import { QueryOptions } from 'infrastructure/QueryOptions';

export interface ISpecificationImpl extends ISpecification {
  query(
    manager: IConnectionManager,
    specification: ISpecification,
    options: QueryOptions
  ): Promise<AggregateAllType[]>;
}
