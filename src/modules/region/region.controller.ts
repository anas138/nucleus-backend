import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegionService } from './region.service';
import { CreateRegionDto } from 'src/dto/region/create-region.dto';
import { FetchRegionModel, RegionCreatedModel } from 'src/models/region.model';
import { OnCreateInterceptor } from 'src/common/interceptors/on-create.interceptor';
import { OnUpdateInterceptor } from 'src/common/interceptors/on-update.interceptor';

@Controller('regions')
@UseGuards(AuthGuard())
@UseInterceptors(new OnCreateInterceptor(), new OnUpdateInterceptor())
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Post()
  async createRegion(
    @Body() createRegionDto: CreateRegionDto,
  ): Promise<RegionCreatedModel> {
    return this.regionService.create(createRegionDto);
  }

  @Get()
  async findAll(): Promise<FetchRegionModel[]> {
    return this.regionService.findAll();
  }

  @Get('/alarm/:id')
  async getRegions(@Param('id') id: number) {
    return this.regionService.getRegions(id);
  }
}
