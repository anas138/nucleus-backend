import { Module } from '@nestjs/common';
import { ObsDeviceController } from './obs-device.controller';
import { ObsDeviceService } from './obs-device.service';
import { ObsDeviceRepository } from './obs-device.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ObserviumDevice } from 'src/entities/obs-device.entity';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { CityModule } from '../city/city.module';
import { ListenerApiModule } from '../listener-api/listener-api.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ObserviumDevice]),
    CityModule,
    ListenerApiModule,
  ],
  controllers: [ObsDeviceController],
  providers: [ObsDeviceService, ObsDeviceRepository, HelperFunctions],
  exports: [ObsDeviceService],
})
export class ObsDeviceModule {}
