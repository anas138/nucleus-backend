import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MngObsAlertsController } from './mng-obs-alerts.controller';
import { MngObsAlertsService } from './mng-obs-alerts.service';
import { MngObsAlertsRepository } from './mng-obs-alerts.repository';
import {
  ObserviumSchema,
  ObsAlerts,
} from 'src/mongoose-schemas/observium-alerts.schema';
import { MongooseConfigModule } from 'src/config/mongoose/mongoose.module';
import { mngObsAlertsProvider } from './mng-obs-alerts.provider';

@Module({
  imports: [MongooseConfigModule],
  controllers: [MngObsAlertsController],
  providers: [
    MngObsAlertsService,
    MngObsAlertsRepository,
    ...mngObsAlertsProvider,
  ],
  exports: [MngObsAlertsService, MngObsAlertsRepository],
})
export class MngObsAlertsModule {}
