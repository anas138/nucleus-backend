import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/services/base.service';
import { EntityManager } from 'typeorm';
import { NceLtpRepository } from './nce-ltp.repository';
import { NceLtp } from 'src/entities/nce-ltp.entity';
import {
  PaginatedResultsModel,
  PaginationCalculatedModel,
  PaginationQueryModel,
} from 'src/models/pagination.model';
import { HelperFunctions } from 'src/common/util/helper-functions';

@Injectable()
export class NceLtpService extends BaseService<NceLtp> {
  constructor(
    private readonly repo: NceLtpRepository,
    private helperFunctions: HelperFunctions,
  ) {
    super(repo);
  }

  create(data: NceLtp, entityManager?: EntityManager) {
    return this.repo.create(data, entityManager);
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryModel,
  ): Promise<PaginatedResultsModel> {
    const calculatedPagination: PaginationCalculatedModel =
      this.helperFunctions.calculatePagination(paginationQuery);
    return this.repo.findAllPaginated(calculatedPagination);
  }
}
