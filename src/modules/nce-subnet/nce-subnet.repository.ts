import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { NceSubnet } from 'src/entities/nce-subnet.entity';
import {
  PaginatedResultsModel,
  PaginationCalculatedModel,
} from 'src/models/pagination.model';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class NceSubnetRepository extends BaseAbstractRepository<NceSubnet> {
  constructor(
    @InjectRepository(NceSubnet)
    private readonly repository: Repository<NceSubnet>,
    private helperFunctions: HelperFunctions,
  ) {
    super(repository);
  }

  async create(data: NceSubnet, entityManager?: EntityManager) {
    if (entityManager) {
      return entityManager.getRepository(NceSubnet).save(data);
    } else {
      return this.repository.save(data);
    }
  }

  async upsert(data: NceSubnet, entityManager: EntityManager) {
    return entityManager.getRepository(NceSubnet).upsert(data, {
      skipUpdateIfNoValuesChanged: true,
      conflictPaths: ['res_id'],
    });
  }
}
