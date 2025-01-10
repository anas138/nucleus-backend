import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ObsNmsService } from './obs-nms.service';
import { ResponseMessageMetadata } from 'src/common/decorators/response-message.decorator';
import { APP_MESSAGES } from 'src/common/enums/enums';
import { SetMetaIgnoreResponseInterceptor } from 'src/common/decorators/ignore-res-interceptor.decorator';
import { Response, response } from 'express';
import { PortBitsGraphDto } from 'src/dto/obs-nms/port-bits-graph.dto';

@Controller('obs-nms')
// @UseGuards(AuthGuard())
export class ObsNmsController {
  constructor(private obsNmsService: ObsNmsService) {}

  @Get('/devices')
  @ResponseMessageMetadata(APP_MESSAGES.OBS_NMS.DEVICES_FETCHED)
  async getAllDevices(): Promise<any> {
    return this.obsNmsService.getAllDevices();
  }

  @Get('/devices/:id')
  @ResponseMessageMetadata(APP_MESSAGES.OBS_NMS.DEVICE_FETCHED)
  async getDeviceById(@Param('id', ParseIntPipe) id: number) {
    return this.obsNmsService.getDeviceById(id);
  }

  @Get('/graphs/port-bits/:id')
  async getGraphImageForPortBits(
    @Res() res: Response,
    @Param('id', ParseIntPipe) id: number,
    @Query() query: PortBitsGraphDto,
  ) {
    res.setHeader('Content-Type', 'image/png');
    const content = await this.obsNmsService.getPortBitsGraph(id, query);
    res.send(content);
  }
}
