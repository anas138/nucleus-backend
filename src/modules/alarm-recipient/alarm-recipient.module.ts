import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlarmFilterConfig } from 'src/entities/alarm-filter-config.entity';
import { AlarmRecipientController } from './alarm-recipient.controller';
import { AlarmRecipientService } from './alarm-recipient.service';
import { AlarmRecipient } from 'src/entities/alarm-recipient.entity';
import { User } from 'src/entities/user.entity';
import { SubDepartment } from 'src/entities/sub-department.entity';
import { AlarmRecipientRepository } from './alarm-recipient.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AlarmRecipient,
      User,
      SubDepartment,
      AlarmFilterConfig,
    ]),
  ],
  controllers: [AlarmRecipientController],
  providers: [AlarmRecipientService, AlarmRecipientRepository],
  exports: [AlarmRecipientService],
})
export class AlarmRecipientModule {}
