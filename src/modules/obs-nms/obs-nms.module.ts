import { Module } from '@nestjs/common';
import { ObsNmsController } from './obs-nms.controller';
import { ObsNmsService } from './obs-nms.service';
import { ObsNmsApiService } from './obs-nms-api.service';
import { EnvironmentConfigService } from 'src/config/environment-config/environment-config.service';

@Module({
  imports: [
    //  ObsDeviceModule,
  ],
  providers: [ObsNmsService, ObsNmsApiService, EnvironmentConfigService],
  controllers: [ObsNmsController],
  exports: [ObsNmsService],
})
export class ObsNmsModule {}
