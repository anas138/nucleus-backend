import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NokiaTxnNetworkElementRepository } from './nokia-txn-network-element.repository';
import { NokiaTxnNetworkElementService } from './nokia-txn-network-element.service';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { NokiaTxnNetworkElementController } from './nokia-txn-network-element.controller';
import { RegionModule } from '../region/region.module';
import { ListenerApiModule } from '../listener-api/listener-api.module';
import { NceSubnetModule } from '../nce-subnet/nce-subnet.module';
import { NceGponNetworkElement } from 'src/entities/nce-gpon-network-element.entity';
import { NokiaTxnNetworkElement } from 'src/entities/nokia-txn-network-element.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NokiaTxnNetworkElement]),
    RegionModule,
    ListenerApiModule,
    NceSubnetModule,
  ],
  providers: [
    NokiaTxnNetworkElementRepository,
    NokiaTxnNetworkElementService,
    HelperFunctions,
  ],
  controllers: [NokiaTxnNetworkElementController],
  exports: [NokiaTxnNetworkElementService],
})
export class NokiaTxnNetworkElementModule {}
