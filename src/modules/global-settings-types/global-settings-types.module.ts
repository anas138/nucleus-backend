import { Module } from '@nestjs/common';
import { GlobalSettingsTypesController } from './global-settings-types.controller';
import { GlobalSettingsTypesService } from './global-settings-types.service';
import { GlobalSettingsTypesRepository } from './global-settings-types.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalSettingsTypes } from 'src/entities/global-setting-types.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalSettingsTypes])],
  controllers: [GlobalSettingsTypesController],
  providers: [GlobalSettingsTypesService, GlobalSettingsTypesRepository],
  exports: [GlobalSettingsTypesService, GlobalSettingsTypesRepository],
})
export class GlobalSettingsTypesModule {}
