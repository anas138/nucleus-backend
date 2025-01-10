import { Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { PaginationDto } from 'src/dto/pagination.dto';
import { AuthGuard } from '@nestjs/passport';
import { NceNetworkElementService } from './nce-network-element.service';
import { INceNetworkElementModel } from 'src/models/nce-network-element.model';
import { APP_MESSAGES, APP_PERMISSIONS } from 'src/common/enums/enums';
import { RolePermissionGuard } from 'src/common/guards/role-permission.guard';
import { PermissionsMetadata } from 'src/common/decorators/permissions.decorator';

@Controller('nce-network-element')
@UseGuards(AuthGuard(), RolePermissionGuard)
export class NceNetworkElementController {
  constructor(private ncenetworkElementService: NceNetworkElementService) {}

  // @Get()
  // async getAllNceNetworkElements(
  //   @Query() paginationDto: PaginationDto,
  // ): Promise<any> {
  //   return this.ncenetworkElementService.findAllPaginated(paginationDto);
  // }

  @Get()
  @PermissionsMetadata(APP_PERMISSIONS.NCE.NETWORK)
  async getAllNceNetworkElements(): Promise<INceNetworkElementModel[]> {
    return this.ncenetworkElementService.findAll();
  }

  @Put('/region')
  @PermissionsMetadata(APP_PERMISSIONS.NCE.NETWORK)
  async updateRegion() {
    return this.ncenetworkElementService.populateRegionFromCsv();
  }

  @Put('/ne-reference-id')
  @PermissionsMetadata(APP_PERMISSIONS.NCE.NETWORK)
  async updateNeReferenceId() {
    return this.ncenetworkElementService.populateNeReferenceId();
  }

  @Put('/sync')
  @PermissionsMetadata(APP_PERMISSIONS.NCE.DEVICESSYNC)
  async syncNetworkElements() {
    // get all NEs and sync with nucleus-database
    await this.ncenetworkElementService.syncNetworkElements();
    return {
      message: APP_MESSAGES.NCE_NMS.NETWORK_ELEMENTS_SYNCHORNIZED,
    };
  }
}
