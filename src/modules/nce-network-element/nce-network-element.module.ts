import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NceNetworkElement } from 'src/entities/nce-network-element.entity';
import { NceNetworkElementRepository } from './nce-network-element.repository';
import { NceNetworkElementService } from './nce-network-element.service';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { NceNetworkElementController } from './nce-network-element.controller';
import { RegionModule } from '../region/region.module';
import { ListenerApiModule } from '../listener-api/listener-api.module';
import { NceSubnetModule } from '../nce-subnet/nce-subnet.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([NceNetworkElement]),
    RegionModule,
    ListenerApiModule,
    NceSubnetModule,
  ],
  providers: [
    NceNetworkElementRepository,
    NceNetworkElementService,
    HelperFunctions,
  ],
  controllers: [NceNetworkElementController],
  exports: [NceNetworkElementService],
})
export class NceNetworkElementModule {}
