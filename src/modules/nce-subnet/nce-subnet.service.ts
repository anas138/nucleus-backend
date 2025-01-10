import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { EntityManager, FindOptionsWhere } from 'typeorm';
import { NceSubnetRepository } from './nce-subnet.repository';
import {
  PaginatedResultsModel,
  PaginationCalculatedModel,
  PaginationQueryModel,
} from 'src/models/pagination.model';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { NceSubnet } from 'src/entities/nce-subnet.entity';

@Injectable()
export class NceSubnetService extends BaseService<NceSubnet> {
  constructor(
    private readonly repo: NceSubnetRepository,
    private helperFunctions: HelperFunctions,
  ) {
    super(repo);
  }

  create(data: NceSubnet, entityManager?: EntityManager) {
    return this.repo.create(data, entityManager);
  }

  upsert(data: NceSubnet, entityManager?: EntityManager) {
    return this.repo.upsert(data, entityManager);
  }
}
