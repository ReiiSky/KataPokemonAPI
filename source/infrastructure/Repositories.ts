import { Account } from 'domain/Account';
import { Scope } from 'domain/Scope';
import { AggregateAllType } from 'domain/context/AggregateAllType';
import { ConnectionManager } from 'infrastructure/ConnectionManager';
import { IEventImpl } from 'infrastructure/IEventImpl';
import { ISpecificationImpl } from 'infrastructure/ISpecificationImpl';
import { QueryRepository } from 'infrastructure/QueryRepository';
import { RepositoriesRegistrator } from 'infrastructure/RepositoriesRegistrator';
import { NotImplemented } from 'infrastructure/error/NotImplemented';
import { Option } from 'package/Option';

export class Repositories {
  // [scope: query repositories]
  private queryRepositoryMap: Map<string, QueryRepository<AggregateAllType>> =
    new Map();
  private commandRepositoryMap: Map<string, IEventImpl[]> = new Map();
  private connectionManager: ConnectionManager;

  constructor(
    registrator: RepositoriesRegistrator,
    _connectionManager: ConnectionManager
  ) {
    this.connectionManager = _connectionManager;

    for (const [scope, impls] of registrator.specifications) {
      this.addQueryRepositoryMap(scope, impls);
    }

    for (const event of registrator.events) {
      const name = event.eventname;
      const eventsInMap = Option.some(
        this.commandRepositoryMap.get(name)
      ).unwrap([]);

      this.commandRepositoryMap.set(event.eventname, [...eventsInMap, event]);
    }
  }

  // TODO: this function should only be leaked in build or main file.
  public addQueryRepositoryMap(scope: string, impls: ISpecificationImpl[]) {
    const queryRepository = new QueryRepository(
      this.connectionManager,
      scope,
      impls
    );
    this.queryRepositoryMap.set(scope, queryRepository);
  }

  private mustGet(scope: Scope) {
    const repository = this.queryRepositoryMap.get(scope);

    if (!repository) {
      throw new NotImplemented(`${scope} query repository`);
    }

    return repository;
  }

  public async save(...aggregates: AggregateAllType[]): Promise<void> {
    const events = aggregates
      .map(aggr => aggr.events)
      .reduce((allEvents, events) => [...allEvents, ...events], []);

    let abortable = true;

    try {
      for (const event of events) {
        const child = event.child;
        const eventImpls = this.commandRepositoryMap.get(child.eventname);

        if (eventImpls.length <= 0) {
          throw new NotImplemented(`${child.eventname} domain event`);
        }

        await Promise.all(
          eventImpls.map(impl => impl.execute(this.connectionManager, event))
        );
      }

      await this.connectionManager.commitAll();
      abortable = false;
    } finally {
      if (abortable) {
        await this.connectionManager.abortAll();
      }
    }
  }

  public async ping() {
    await this.connectionManager.pingAll();
  }

  public get Account() {
    return this.mustGet(Scope.Account) as QueryRepository<Account>;
  }
}
