import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { LdiSoftSwitchTrunkGroupRepository } from './ldi-softswitch-trunk-group.repository';
import { LdiSoftswitchTrunkGroup } from 'src/entities/ldi-softswitch-trunk-group.entity';

@Injectable()
export class LdiSoftSwitchTrunkGroupService extends BaseService<LdiSoftswitchTrunkGroup> {
  constructor(
    private readonly ldiSoftSwitchTrunkGroupRepository: LdiSoftSwitchTrunkGroupRepository,
  ) {
    super(ldiSoftSwitchTrunkGroupRepository);
  }
}
