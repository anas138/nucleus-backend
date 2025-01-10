import { Region } from 'src/entities/region.entity';
import { BaseAbstractRepository } from './base/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IRegionRepository } from 'src/interfaces/region.repository.interface';

export class RegionRepository
  extends BaseAbstractRepository<Region>
  implements IRegionRepository
{
  constructor(
    @InjectRepository(Region)
    private readonly regionRepository: Repository<Region>,
  ) {
    super(regionRepository);
  }

  async getRegions(id: number) {
    const queryBuilder = await this.regionRepository.query(`
   SELECT  r.name AS region, r.id as regionId
    FROM observium_alert oa
    LEFT JOIN observium_device od ON od.device_id = oa.device_id
    LEFT JOIN region r ON r.id=od.region_id
    WHERE oa.id = '${id}'
    UNION 
    SELECT r.name AS region, r.id as regionId
    FROM nce_alarm nc
    LEFT JOIN nce_network_element ne ON nc.ne_resource_id = ne.resource_id
    LEFT JOIN region r ON r.id = ne.region_id
    WHERE nc.id= '${id}'
    UNION
    SELECT r.name AS region, r.id as regionId
    FROM nce_gpon_alarm nc
    LEFT JOIN nce_network_element ne ON nc.ne_resource_id = ne.resource_id
    LEFT JOIN region r ON r.id = ne.region_id
    WHERE nc.id= '${id}'
    `);
    return queryBuilder[0];
  }
}
