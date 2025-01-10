import { Controller, Get, Put } from '@nestjs/common';
import { NceNmsService } from './nce-nms.service';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';

/**
 * REST APIs Integrated with NCE Huawei NMS and return same/transformed response
 */
@Controller('nce-nms')
// @UseGuards(AuthGuard())
export class NceNmsController {
  constructor(private readonly nceNmsService: NceNmsService) {}
  @Get('/network-elements')
  async getNetworkElements() {
    return this.nceNmsService.getNetworkElements();
  }

  @Put('/sync-network-elements')
  async syncNetworkElements() {
    // get all NEs and sync with nucleus-database
    await this.nceNmsService.syncNetworkElements();
    return {
      message: APP_MESSAGES.NCE_NMS.NETWORK_ELEMENTS_SYNCHORNIZED,
    };
  }

  @Put('/sync-ltps')
  async syncLtps() {
    // get all NEs and sync with nucleus-database
    await this.nceNmsService.syncLtps();
    return {
      message: APP_MESSAGES.NCE_NMS.LTPS_SYNCHORNIZED,
    };
  }

  @Get('/subnet')
  async getSubnet() {
    return this.nceNmsService.getSubnets();
  }

  @Put('/sync-subnets')
  @ResponseMessageMetadata(APP_MESSAGES.NCE_NMS.SUBNETS_SYNCHRONIZED)
  async syncSubnets() {
    await this.nceNmsService.syncSubnets();
  }
}
