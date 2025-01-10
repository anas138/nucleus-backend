import { InjectRepository } from '@nestjs/typeorm';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Repository } from 'typeorm';
import { LdiSoftswitchTrunkGroup } from 'src/entities/ldi-softswitch-trunk-group.entity';

export class LdiSoftSwitchTrunkGroupRepository extends BaseAbstractRepository<LdiSoftswitchTrunkGroup> {
  constructor(
    @InjectRepository(LdiSoftswitchTrunkGroup)
    private readonly ldiSoftswitchTrunkGroup: Repository<LdiSoftswitchTrunkGroup>,
  ) {
    super(ldiSoftswitchTrunkGroup);
  }
}
