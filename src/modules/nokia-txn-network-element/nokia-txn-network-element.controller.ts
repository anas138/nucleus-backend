import { Controller, Get, Put, Query, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { NokiaTxnNetworkElementService } from './nokia-txn-network-element.service';
import { APP_MESSAGES, APP_PERMISSIONS } from 'src/common/enums/enums';
import { RolePermissionGuard } from 'src/common/guards/role-permission.guard';
import { PermissionsMetadata } from 'src/common/decorators/permissions.decorator';
import { INceGponNetworkElementModel } from 'src/models/nce-gpon-network-element.model';
import { INokiaTxnNetworkElementModel } from 'src/models/nokia-txn-network-element.model';

@Controller('nokia-txn-network-element')
@UseGuards(AuthGuard(), RolePermissionGuard)
export class NokiaTxnNetworkElementController {
  constructor(
    private nceGponNetworkElementService: NokiaTxnNetworkElementService,
  ) {}

  @Get()
  @PermissionsMetadata(APP_PERMISSIONS.PUBLIC)
  async getAllNceGponNetworkElements(): Promise<
    INokiaTxnNetworkElementModel[]
  > {
    return this.nceGponNetworkElementService.findAll();
  }

  // @Put('/region')
  // @PermissionsMetadata(APP_PERMISSIONS.NCE.NETWORK)
  // async updateRegion() {
  //   return this.nceGponNetworkElementService.populateRegionFromCsv();
  // }

  // @Put('/ne-reference-id')
  // @PermissionsMetadata(APP_PERMISSIONS.NCE.NETWORK)
  // async updateNeReferenceId() {
  //   return this.nceGponNetworkElementService.populateNeReferenceId();
  // }

  @Put('/sync')
  @PermissionsMetadata(APP_PERMISSIONS.PUBLIC)
  async syncNetworkElements() {
    await this.nceGponNetworkElementService.syncGponNetworkElements();
    return {
      message: APP_MESSAGES.NCE_NMS.NETWORK_ELEMENTS_SYNCHORNIZED,
    };
  }
}
