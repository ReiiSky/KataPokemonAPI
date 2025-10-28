import { RepositoriesRegistrator } from 'infrastructure/RepositoriesRegistrator';
import { ConnectionManagerBuilder } from 'infrastructure/ConnectionManagerBuilder';
import { ContextInstance } from 'infrastructure/ContextInstance';
import { KernelInstance } from 'infrastructure/KernelInstance';
import { Context } from 'infrastructure/Context';
import { ServiceContainer } from 'application/service/ServiceContainer';
import { InvalidValue } from 'package/validator/error/InvalidValue';
import { Logger } from 'package/log/Logger';

export class Kernel {
  private static _instance: Kernel;
  private readonly repositoryRegistrator: RepositoriesRegistrator;
  private readonly connectionBuilder: ConnectionManagerBuilder;
  private readonly logger: Logger;
  private readonly timeoutMSPerContext: number;
  private readonly services: ServiceContainer;

  // Explanation: using instance object in this class is good approach
  // the class parameter dynamically can be added or removed, and
  // the total of parameter could be more than 3.
  private constructor(instance: KernelInstance) {
    this.logger = instance.logger;
    this.services = instance.services;
    this.repositoryRegistrator = instance.repositoryRegistrator;
    this.connectionBuilder = instance.connectionBuilder;
    this.timeoutMSPerContext = instance.timeoutMSPerContext
      .should(timeout => timeout >= 2000)
      .unwrap(16000);
  }

  public newContext() {
    const instance: ContextInstance = {
      logGroup: Kernel.instance().newLogGroup(),
      repositoryRegistrator: this.repositoryRegistrator,
      lazyInitService: ctx => this.services.build(ctx),
      lazyInitConnectionManager: ctx => this.connectionBuilder.build(ctx),
    };

    return new Context(this.timeoutMSPerContext, instance);
  }

  private static isKernelInitialized() {
    return !!Kernel._instance;
  }

  public static construct(instance: KernelInstance) {
    const isInitialized = Kernel.isKernelInitialized();

    if (!isInitialized) {
      Kernel._instance = new Kernel(instance);
    }

    return Kernel._instance;
  }

  public static instance() {
    const isInitialized = Kernel.isKernelInitialized();

    if (!isInitialized) {
      throw new InvalidValue('instance', 'Kernel never initialized');
    }

    return Kernel._instance;
  }

  public newLogGroup() {
    return this.logger.newGroup();
  }
}
