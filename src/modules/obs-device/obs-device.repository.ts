import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { ObserviumDevice } from 'src/entities/obs-device.entity';
import { IObsDevice } from 'src/models/obs-device.model';
import {
  PaginatedResultsModel,
  PaginationCalculatedModel,
} from 'src/models/pagination.model';
import { BaseAbstractRepository } from 'src/repositories/base/base.repository';
import { Brackets, EntityManager, Repository } from 'typeorm';

@Injectable()
export class ObsDeviceRepository extends BaseAbstractRepository<ObserviumDevice> {
  constructor(
    @InjectRepository(ObserviumDevice)
    private repo: Repository<ObserviumDevice>,
    private helperFunctions: HelperFunctions,
  ) {
    super(repo);
  }

  async create(data: IObsDevice, entityManager?: EntityManager) {
    if (entityManager) {
      return entityManager.getRepository(ObserviumDevice).save(data);
    } else {
      return this.repo.save(data);
    }
  }
  public getEntityColumnNames(): String[] {
    return ['location_state', 'hostname', 'location_county'];
  }
  async findAllPaginated(
    paginationModel?: PaginationCalculatedModel,
  ): Promise<PaginatedResultsModel> {
    const { take, skip, search, orderBy, orderDirection, ...attributes } =
      paginationModel;
    const columnNames = this.getEntityColumnNames();
    const queryBuilder = this.repo.createQueryBuilder();
    if (search) {
      queryBuilder.andWhere(
        new Brackets((searchBrackets) => {
          // Check if any of the columnNames matches the search keyword
          const searchConditions: string[] = columnNames.map((columnName) => {
            return `${columnName} LIKE :keyword`;
          });

          // Add the search condition if at least one column matches
          if (searchConditions.length > 0) {
            searchBrackets.where(searchConditions.join(' OR '), {
              keyword: `%${search}%`,
            });
          }
        }),
      );
    }

    const attributesLength = Object.keys(attributes).length;
    if (attributesLength) {
      queryBuilder.andWhere(
        new Brackets((attrBrackets) => {
          const attributeConditions: string[] = [];

          for (let key of Object.keys(attributes)) {
            if (attributes[key]) {
              attributeConditions.push(`${key} LIKE :${key}`);
            }
          }

          // Add the attribute conditions if any attribute matches
          if (attributeConditions.length > 0) {
            attrBrackets.where(attributeConditions.join(' AND '), attributes);
          }
        }),
      );
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