import { Controller, Get, UseGuards } from '@nestjs/common';
import { LdiSoftSwitchTrunkGroupService } from './ldi-softswitch-trunk-group.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('ldi-softswitch')
@UseGuards(AuthGuard())
export class LdiSoftSwitchTrunkGroupController {
  constructor(
    private readonly ldiSoftSwitchTrunkGroupService: LdiSoftSwitchTrunkGroupService,
  ) {}
  @Get('/trunk')
  async getLdiSoftSwitches() {
    return this.ldiSoftSwitchTrunkGroupService.findAll();
  }
}
