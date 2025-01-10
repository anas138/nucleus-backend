import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { NceLtp } from 'src/entities/nce-ltp.entity';
import {
  PaginatedResultsModel,
  PaginationCalculatedModel,
} from 'src/models/pagination.model';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class NceLtpRepository extends BaseAbstractRepository<NceLtp> {
  constructor(
    @InjectRepository(NceLtp)
    private readonly repository: Repository<NceLtp>,
    private helperFunctions: HelperFunctions,
  ) {
    super(repository);
  }

  async create(data: NceLtp, entityManager?: EntityManager) {
    if (entityManager) {
      return entityManager.getRepository(NceLtp).save(data);
    } else {
      return this.repository.save(data);
    }
  }
  public getEntityColumnNames(): String[] {
    return ['name', 'work_band_parity'];
  }
  async findAllPaginated(
    paginationModel?: PaginationCalculatedModel,
  ): Promise<PaginatedResultsModel> {
    const { take, skip, search, orderBy, orderDirection, ...attributes } =
      paginationModel;
    const columnNames = this.getEntityColumnNames();
    const queryBuilder = this.repository.createQueryBuilder();
    if (search) {
      columnNames.forEach((columnName) => {
        queryBuilder.orWhere(`${columnName} LIKE :keyword`, {
          keyword: `%${search}%`,
        });
      });
    }
    const attributesLength = Object.keys(attributes).length;
    if (attributesLength) {
      for (let key of Object.keys(attributes)) {
        if (attributes[key]) {
          queryBuilder.andWhere(`${key} LIKE :keyword`, {
            keyword: `%${attributes[key]}%`,
          });
        }
      }
    }
    if (orderBy && orderDirection) {
      queryBuilder.addOrderBy(`${orderBy}`, orderDirection);
    }
    const [entities, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .getManyAndCount();

    const basicPaginationProps =
      this.helperFunctions.calculatPaginationProperties(total, take, skip);

    return {
      ...basicPaginationProps,
      list: entities,
    };
  }
}
