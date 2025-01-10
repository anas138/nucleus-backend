import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NceGponNetworkElementRepository } from './nce-gpon-network-element.repository';
import { NceGponNetworkElementService } from './nce-gpon-network-element.service';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { NceGponNetworkElementController } from './nce-gpon-network-element.controller';
import { RegionModule } from '../region/region.module';
import { ListenerApiModule } from '../listener-api/listener-api.module';
import { NceSubnetModule } from '../nce-subnet/nce-subnet.module';
import { NceGponNetworkElement } from 'src/entities/nce-gpon-network-element.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NceGponNetworkElement]),
    RegionModule,
    ListenerApiModule,
    NceSubnetModule,
  ],
  providers: [
    NceGponNetworkElementRepository,
    NceGponNetworkElementService,
    HelperFunctions,
  ],
  controllers: [NceGponNetworkElementController],
  exports: [NceGponNetworkElementService],
})
export class NceGponNetworkElementModule {}
