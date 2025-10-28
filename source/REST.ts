import { HealthCheckController } from 'application/controller/HealthCheckController';
import { S3Config } from 'application/service/S3Config';
import { ServiceContainer } from 'application/service/ServiceContainer';
import { Scope } from 'domain/Scope';
import { InvalidConfig } from 'error/InvalidConfig';
import { ConnectionManagerBuilder } from 'infrastructure/ConnectionManagerBuilder';
import { Kernel } from 'infrastructure/Kernel';
import { RepositoriesRegistrator } from 'infrastructure/RepositoriesRegistrator';
import { VarConfig } from 'infrastructure/VarConfig';
import { PostgresBuilder } from 'infrastructure/connection/PostgresBuilder';
import { PostgresConnection } from 'infrastructure/connection/PostgresConnection';
import { EmptyAccount } from 'infrastructure/implementation/EmptyAccount';
import { HealthCheckAdaptor } from 'interface/koa/HealthCheckAdaptor';
import { KoaAdapters } from 'interface/koa/KoaAdapters';
import { Config } from 'package/Config';
import { Option } from 'package/Option';
import { Logger } from 'package/log/Logger';
import { ConsoleLogger } from 'package/log/ConsoleLogger';
import { LogGroup } from 'package/log/LogGroup';
import { LogCloser } from 'package/log/LogCloser';
import { PGRegisterAccount } from 'infrastructure/implementation/PGRegisterAccount';
import { RegisterAdaptor } from 'interface/koa/RegisterAdaptor';
import { RegisterAccountController } from 'application/controller/RegisterAccountController';

export class REST {
  private readonly koaAdapter: KoaAdapters;

  constructor() {
    const config: Config = VarConfig.load();
    const connectionManagerBuilder = this.createConnectionManager(config);
    const services = this.createServices(config);

    this.createKernel(
      connectionManagerBuilder,
      services,
      config.getNumber('TIMEOUT_PER_CONTEXT'),
      this.constructLogGroup()
    );

    this.koaAdapter = new KoaAdapters(config.getNumber('PORT').unwrap(3000));
    this.registerAdaptor();
  }

  private constructLogGroup(): () => LogGroup & LogCloser {
    return () =>
      new ConsoleLogger({
        colorize: true,
        pretty: true,
      });
  }

  private registerAdaptor() {
    this.koaAdapter
      .add(new HealthCheckAdaptor(new HealthCheckController()))
      .add(new RegisterAdaptor(new RegisterAccountController()));
  }

  private createServices(config: Config) {
    const s3config = this.getS3Config(config);

    return new ServiceContainer({
      s3: s3config,
    });
  }

  private getS3Config(config: Config): S3Config {
    const endpoint = config.getString('S3_ENDPOINT');
    const bucket = config.getString('S3_BUCKET');
    const accessKey = config.getString('S3_ACCESS_KEY');
    const secretKey = config.getString('S3_SECRET_KEY');

    const options = [accessKey, secretKey, bucket, endpoint];

    for (const option of options) {
      if (option.isNone) {
        throw new InvalidConfig('S3 configuration', 'undefined');
      }
    }

    return {
      endpoint: endpoint.yolo(),
      bucket: bucket.yolo(),
      accessKey: accessKey.yolo(),
      secretKey: secretKey.yolo(),
      region: 'ap-southeast-1',
    };
  }

  private createConnectionManager(config: Config) {
    const postgresConfig = this.createPostgresConfig(config);

    PostgresConnection.patchConfigOnce(postgresConfig);

    const pgBuilder = new PostgresBuilder();

    return new ConnectionManagerBuilder().add(pgBuilder);
  }

  private createPostgresConfig(config: Config) {
    return {
      host: config.getString('POSTGRES_HOST').unwrap('127.0.0.1'),
      port: config.getNumber('POSTGRES_PORT').unwrap(5432),
      user: config.getString('POSTGRES_USER').unwrap('postgres'),
      pass: config.getString('POSTGRES_PASS').unwrap('Postgres123!@#'),
      db: config.getString('POSTGRES_DB').unwrap('all'),
      options: {
        connectionLimit: config.getNumber('CONNECTION_LIMIT').unwrap(10),
        pgbouncer: config
          .getString('PGBOUNCER')
          .use(v => v === 'true')
          .unwrap(false),
      },
    };
  }

  private createKernel(
    connectionManagerBuilder: ConnectionManagerBuilder,
    services: ServiceContainer,
    timeoutMSPerContext: Option<number>,
    logCollectorFn: () => LogGroup & LogCloser
  ) {
    const registrator = new RepositoriesRegistrator()
      .addEvent(new PGRegisterAccount())
      .scope(Scope.Account)
      .addSpecification(new EmptyAccount());

    return Kernel.construct({
      connectionBuilder: connectionManagerBuilder,
      repositoryRegistrator: registrator,
      timeoutMSPerContext,
      services,
      logger: new Logger(logCollectorFn),
    });
  }

  public get callback() {
    return this.koaAdapter.callback;
  }

  public listen() {
    this.koaAdapter.listen(async port => {
      const lg = Kernel.instance().newLogGroup();
      lg.info().string('start', `Server running on port: ${port}`);

      await lg.close();
    });
  }
}
