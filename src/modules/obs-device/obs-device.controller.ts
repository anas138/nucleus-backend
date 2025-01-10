import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Res,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ObsDeviceService } from './obs-device.service';
import { IObsDevice } from 'src/models/obs-device.model';
import { APP_MESSAGES, APP_PERMISSIONS } from 'src/common/enums/enums';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { PaginationDto } from 'src/dto/pagination.dto';
import { PaginatedResultsModel } from 'src/models/pagination.model';
import { PortBitsGraphDto } from 'src/dto/obs-nms/port-bits-graph.dto';
import { Response } from 'express';
import { RolePermissionGuard } from 'src/common/guards/role-permission.guard';
import { PermissionsMetadata } from 'src/common/decorators/permissions.decorator';

@Controller('obs-device')
@UseGuards(AuthGuard(), RolePermissionGuard)
export class ObsDeviceController {
  constructor(private obsDeviceService: ObsDeviceService) {}

  // @Get()
  // @ResponseMessageMetadata(APP_MESSAGES.OBS_DEVICE.DEVICES_FETCHED)
  // async getAllDevices(
  //   @Query() paginationDto: PaginationDto,
  // ): Promise<PaginatedResultsModel> {
  //   return this.obsDeviceService.findAllPaginated(paginationDto);
  // }

  @Get()
  @PermissionsMetadata(APP_PERMISSIONS.OBSERVIUM.DEVICES)
  @ResponseMessageMetadata(APP_MESSAGES.OBS_DEVICE.DEVICES_FETCHED)
  async getAllDevicesWithoutPagination(): Promise<IObsDevice[]> {
    return this.obsDeviceService.findAll();
  }

  @Get(':id')
  @PermissionsMetadata(APP_PERMISSIONS.OBSERVIUM.DEVICES)
  @ResponseMessageMetadata(APP_MESSAGES.OBS_DEVICE.DEVICE_FETCHED)
  async getDeviceById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<IObsDevice> {
    return this.obsDeviceService.findById({ device_id: id });
  }

  @Put('/region-city')
  @PermissionsMetadata(APP_PERMISSIONS.OBSERVIUM.DEVICES)
  async updateRegion() {
    return this.obsDeviceService.populateRegionAndCityFromCsv();
  }

  @Put('/sync')
  @PermissionsMetadata(APP_PERMISSIONS.OBSERVIUM.DEVICESSYNC)
  @ResponseMessageMetadata(APP_MESSAGES.OBS_NMS.OBS_DEVICES_SYNCHORNIZED)
  async syncObsDevices() {
    await this.obsDeviceService.syncObsDevices();
  }

  @Get('/graphs/port-bits/:id')
  @PermissionsMetadata(APP_PERMISSIONS.OBSERVIUM.NETWORK)
  async getGraphImageForPortBits(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PortBitsGraphDto,
  ) {
    res.setHeader('Content-Type', 'image/png');
    const content = await this.obsDeviceService.getPortBitsGraph(id, query);
    res.send(content);
  }
}
