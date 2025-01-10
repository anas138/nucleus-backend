import { DataSource, DataSourceOptions } from 'typeorm';
import Entities from '../../entities/db';
import { config } from 'dotenv';

config();
const databaseConfigurations: DataSourceOptions = {
  type: process.env.DATABASE_TYPE as any,
  port: parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  host: process.env.DATABASE_HOST,
  entities: Entities,
  cache: false,
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  logging: true,
};

export const getDataSource = (() => {
  const dataSource = new DataSource(databaseConfigurations);
  return dataSource;
})();
