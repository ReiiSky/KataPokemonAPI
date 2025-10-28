export type PostgresConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  db: string;

  options: {
    connectionLimit: number;
    pgbouncer: boolean;
  };
};
