import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SegmentService } from './segment.service';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';

@Controller('segments')
@UseGuards(AuthGuard())
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class SegmentController {
  constructor(private readonly segmentService: SegmentService) {}

  @Post()
  async createSegment(): Promise<any> {
    return this.segmentService.findAll();
  }

  @Get()
  async findAll(): Promise<any> {
    return this.segmentService.findAll();
  }
}
