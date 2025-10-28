import { Option } from 'package/Option';
import { ISpecification } from 'domain/context/ISpecification';
import { ConnectionManager } from './ConnectionManager';
import { ISpecificationImpl } from './ISpecificationImpl';
import { NotImplemented } from 'infrastructure/error/NotImplemented';
import { QueryOptions } from 'infrastructure/QueryOptions';
import { AggregateAllType } from 'domain/context/AggregateAllType';

export class QueryRepository<T extends AggregateAllType> {
  private implMap: Map<string, ISpecificationImpl> = new Map();

  constructor(
    private readonly connectionManager: ConnectionManager,
    private readonly scope: string,
    impls: ISpecificationImpl[]
  ) {
    for (const impl of impls) {
      this.implMap.set(impl.specname, impl);
    }
  }

  private mustGetImpl(specName: string): ISpecificationImpl {
    const impl = this.implMap.get(specName);

    if (!impl) {
      throw new NotImplemented(`${specName} in scope ${this.scope}`);
    }

    return impl;
  }

  public async getOne(
    spec: ISpecification,
    options = this.newOptions()
  ): Promise<Option<T>> {
    const results = await this.get(spec, options);

    if (results.length <= 0) {
      return Option.none();
    }

    return Option.some(results[0]);
  }

  public async get(
    spec: ISpecification,
    options = this.newOptions()
  ): Promise<T[]> {
    const impl = this.mustGetImpl(spec.specname);
    const results = await impl.query(this.connectionManager, spec, options);

    if (results.length <= 0 && options.alternativeIfNone.length > 0) {
      const alternativeSpec = options.alternativeIfNone[0];
      const alternativeOptions = {
        ...options,
        alternativeIfNone: options.alternativeIfNone.slice(1),
      };

      return await this.get(alternativeSpec, alternativeOptions);
    }

    if (results.length <= 0) {
      return [];
    }

    return results as T[];
  }

  public newOptions(): QueryOptions {
    return {
      alternativeIfNone: [],
      attributes: [],
      paranoid: true,
      useCache: false,
      limit: 1,
      offset: 0,
    };
  }
}
