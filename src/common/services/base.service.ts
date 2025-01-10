import { IBaseRepository } from 'src/interfaces/base.repository.interface';
import {
  EntityManager,
  FindManyOptions,
  FindOptionsOrder,
  FindOptionsWhere,
} from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RecordStatus } from '../enums/enums';
import {
  PaginatedResultsModel,
  PaginationQueryModel,
} from 'src/models/pagination.model';
import { HelperFunctions } from '../util/helper-functions';

const helperFunctions: HelperFunctions = new HelperFunctions();
@Injectable()
export abstract class BaseService<T> {
  constructor(private readonly repository: IBaseRepository<T>) {}

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.findAll(options);
  }
  async findAllPaginated(
    paginationQuery?: PaginationQueryModel,
  ): Promise<PaginatedResultsModel> {
    let calculatedPagination = null;
    if (paginationQuery) {
      calculatedPagination =
        helperFunctions.calculatePagination(paginationQuery);
    }
    return this.repository.findAllPaginated(calculatedPagination);
  }

  async findById(id: FindOptionsWhere<T>): Promise<T> {
    return this.repository.findOneById(id);
  }

  public async findByCondition(
    filterCondition: FindOptionsWhere<T>,
    order?: FindOptionsOrder<T>,
    relations?: any,
  ): Promise<T> {
    try {
      return await this.repository.findByCondition(
        filterCondition,
        order,
        relations,
      );
    } catch (error) {
      console.log(error, 'e');
      return error;
    }
  }

  async create(data: Partial<T>, entityManager?: EntityManager): Promise<T> {
    return this.repository.create(data, entityManager);
  }

  async update(id: FindOptionsWhere<T>, data: Partial<T>): Promise<T> {
    const existingData = await this.findById(id);
    if (existingData) {
      return this.repository.update({ ...existingData, ...data });
    }
    throw new NotFoundException('Data not found');
  }

  public async updateWithCondition(
    condition: FindOptionsWhere<T>,
    payload: FindOptionsWhere<T>,
    entityManager?: EntityManager,
  ): Promise<any> {
    if (entityManager) {
      return this.repository.updateWithCondition(
        condition,
        payload,
        entityManager,
      );
    }
    return this.repository.updateWithCondition(condition, payload);
  }

  async updateWithTransactionScope(
    id: FindOptionsWhere<T>,
    data: Partial<T>,
    entityManager: EntityManager,
  ): Promise<T> {
    const existingData = await this.findById(id);
    if (existingData) {
      return this.repository.updateWithTransactionScope(
        { ...existingData, ...data },
        entityManager,
      );
    }
    throw new NotFoundException('Data not found');
  }

  async remove(payload: T): Promise<T> {
    payload['record_status'] = RecordStatus.DELETED;
    return this.repository.remove(payload);
  }
  async deleteRecord(payload: {}, entityManager?: EntityManager) {
    return this.repository.deleteRecord(payload, entityManager);
  }

  async count(payload: FindManyOptions<T>): Promise<number> {
    return this.repository.count(payload);
  }
}
