import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmFilterAdvanceCondition } from 'src/entities/alarm-filter-advance-condition.entity';
import { AlarmFilterConfig } from 'src/entities/alarm-filter-config.entity';
import { AlarmFilterAdvanceConditionController } from './alarm-filter-advance-condition.controller';
import { AlarmFilterAdvanceConditionService } from './alarm-filter-advance-condition.service';
import { AlarmFilterAdvanceConditionRepository } from './alarm-filter-advance-condition.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlarmFilterAdvanceCondition, AlarmFilterConfig]),
  ],
  controllers: [AlarmFilterAdvanceConditionController],
  providers: [
    AlarmFilterAdvanceConditionService,
    AlarmFilterAdvanceConditionRepository,
  ],
  exports: [AlarmFilterAdvanceConditionService],
})
export class AlarmFilterAdvanceConditionModule {}
