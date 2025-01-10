import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NceLtp } from 'src/entities/nce-ltp.entity';
import { NceLtpService } from './nce-ltp.service';
import { NceLtpRepository } from './nce-ltp.repository';
import { HelperFunctions } from 'src/common/util/helper-functions';

@Module({
  imports: [TypeOrmModule.forFeature([NceLtp])],
  providers: [NceLtpService, NceLtpRepository, HelperFunctions],
  exports: [NceLtpService],
})
export class NceLtpModule {}
