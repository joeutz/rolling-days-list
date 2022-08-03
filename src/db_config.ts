import { DataSource, DataSourceOptions } from 'typeorm';

export const dataConfig = {
  type: 'postgres',
  host: 'localhost',
  port: 55000,
  username: 'postgres',
  password: 'postgrespw',
  database: 'rolling_days',
  entities: ['dist/**/*.entity{ .ts,.js}'],
  synchronize: false,
  migrations: ['src/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations_rolling_days',
  migrationsRun: true,
};

export default new DataSource(dataConfig as DataSourceOptions);
