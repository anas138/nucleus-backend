import { Module } from '@nestjs/common';
import { EmailLogsRepository } from './email-logs.repository';
import { EmailLogsService } from './email-logs.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailLogs } from 'src/entities/email-logs.entity';
import { EmailLogsController } from './email-log.controller';
import { HelperFunctions } from 'src/common/util/helper-functions';

@Module({
  imports: [TypeOrmModule.forFeature([EmailLogs])],
  controllers: [EmailLogsController],
  providers: [EmailLogsService, EmailLogsRepository, HelperFunctions],
  exports: [EmailLogsService, EmailLogsRepository],
})
export class EmailLogsModule {}
