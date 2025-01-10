import { DataSource } from 'typeorm';
import { databaseConfigurations } from './typeorm.config';

export const getDataSource = (() => {
  const dataSource = new DataSource(databaseConfigurations);
  return dataSource;
})();
