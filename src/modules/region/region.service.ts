import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { Region } from 'src/entities/region.entity';
import { IRegionRepository } from 'src/interfaces/region.repository.interface';
import {
  CreateRegionModel,
  FetchRegionModel,
  RegionCreatedModel,
} from 'src/models/region.model';
import { RegionRepository } from 'src/repositories/region.repository';

@Injectable()
export class RegionService extends BaseService<Region> {
  constructor(private readonly regionRepository: RegionRepository) {
    super(regionRepository);
  }

  async getRegions(id: number) {
    return this.regionRepository.getRegions(id);
  }
}
