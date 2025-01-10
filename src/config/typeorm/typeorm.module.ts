import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentConfigModule } from '../environment-config/environment-config.module';
import { databaseConfigurations } from './typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfigurations),
    EnvironmentConfigModule,
  ],
  exports: [TypeOrmModule.forRoot(databaseConfigurations)],
})
export class TypeOrmConfigModule {}
