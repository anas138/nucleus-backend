import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NceSubnetService } from './nce-subnet.service';
import { NceSubnetRepository } from './nce-subnet.repository';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { NceSubnet } from 'src/entities/nce-subnet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NceSubnet])],
  providers: [NceSubnetService, NceSubnetRepository, HelperFunctions],
  exports: [NceSubnetService],
})
export class NceSubnetModule { }
