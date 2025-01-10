import { Module } from '@nestjs/common';
import { LdiSoftSwitchTrunkGroupController } from './ldi-softswitch-trunk-group.controller';
import { LdiSoftSwitchTrunkGroupRepository } from './ldi-softswitch-trunk-group.repository';
import { LdiSoftSwitchTrunkGroupService } from './ldi-softswitch-trunk-group.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LdiSoftswitchTrunkGroup } from 'src/entities/ldi-softswitch-trunk-group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LdiSoftswitchTrunkGroup])],
  controllers: [LdiSoftSwitchTrunkGroupController],
  providers: [
    LdiSoftSwitchTrunkGroupRepository,
    LdiSoftSwitchTrunkGroupService,
  ],
  exports: [LdiSoftSwitchTrunkGroupRepository, LdiSoftSwitchTrunkGroupService],
})
export class LdiSoftSwitchTrunkGroupModule {}
