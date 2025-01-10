import { EnvironmentConfigService } from '../environment-config/environment-config.service';
import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import Entities from '../../entities/db';
const configSerivce = new EnvironmentConfigService(new ConfigService());

export const databaseConfigurations: DataSourceOptions = {
  type: configSerivce.getDatabaseType(),
  port: configSerivce.getDatabasePort(),
  username: configSerivce.getDatabaseUser(),
  password: configSerivce.getDatabasePassword(),
  database: configSerivce.getDatabaseName(),
  synchronize: configSerivce.getDatabaseSync(),
  host: configSerivce.getDatabaseHost(),
  entities: Entities,
  cache: false,
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  logging: configSerivce.isDatabaseLoggingEnabled(),
  poolSize: 100
};
