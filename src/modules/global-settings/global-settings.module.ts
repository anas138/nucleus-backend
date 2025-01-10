import { Module } from '@nestjs/common';
import { GlobalSettingsService } from './global-settings.service';
import { GlobalSettingsRepository } from './global-settings.repository';
import { GlobalSettingsController } from './global-settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalSettings } from 'src/entities/global-settings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GlobalSettings])],
  controllers: [GlobalSettingsController],
  providers: [GlobalSettingsService, GlobalSettingsRepository],
  exports: [GlobalSettingsService, GlobalSettingsRepository],
})
export class GlobalSettingsModule {}
